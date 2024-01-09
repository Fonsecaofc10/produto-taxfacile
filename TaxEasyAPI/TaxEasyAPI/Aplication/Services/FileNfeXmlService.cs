using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson.Serialization;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Xml;
using System.Xml.Serialization;
using TaxFacileAPI.Aplication.DTOs;
using TaxFacileAPI.Aplication.Interfaces;
using TaxFacileAPI.Domain.Entities;
using TaxFacileAPI.InfraData.Services;
using Newtonsoft.Json;
using System.Linq.Expressions;

namespace TaxFacileAPI.Aplication.Services
{
    public class FileNfeXmlService : IFileNfeXmlService
    {
        private readonly IMongoDatabase _dbMongo;

        public FileNfeXmlService(IMongoDatabase dbMongo)
        {
            _dbMongo = dbMongo;
        }

        public async Task<List<XmlUploadResultDTO>> UploadFileAsync([FromForm] IList<IFormFile> files, string pathStorage, CancellationToken cancellationtoken)
        {
            var xmlResult = new List<XmlUploadResultDTO>();

            long size = files.Sum(f => f.Length);

            try
            {
                foreach (var formFile in files)
                {
                    if (formFile.Length > 0)
                    {
                        string xmlContent = LoadContentFile(formFile);

                        var chNFe = "";
                        var result = ValidateXmlNfe(xmlContent, out chNFe);

                        if (chNFe.Length == 44)
                        {
                            //var res = await WriteFile(formFile, pathStorage);
                            
                            var existNfe = await ExistChNFeAsync(chNFe);

                            if (!existNfe)
                            {
                                XmlDocument doc = new XmlDocument();
                                doc.LoadXml(xmlContent);
                                XmlNode xmlNfeContentNode = doc.DocumentElement!;

                                var nfeXml = new NfeXmlEntity();
                                nfeXml.ChNFe = chNFe;
                                nfeXml.XmlContent = xmlNfeContentNode;

                                var res = await InsertIntoNfeXml(nfeXml);

                                if (res == true)
                                {
                                    xmlResult.Add(new XmlUploadResultDTO
                                    {
                                        XmlFileName = formFile.FileName,
                                        XmlResult = "ok"
                                    });
                                }
                                else
                                {
                                    xmlResult.Add(new XmlUploadResultDTO
                                    {
                                        XmlFileName = formFile.FileName,
                                        XmlResult = "falha ao tentar salvar, envie novamente."
                                    });
                                }
                            }
                            else
                            {
                                xmlResult.Add(new XmlUploadResultDTO
                                {
                                    XmlFileName = formFile.FileName,
                                    XmlResult = "Rejeitado, XML da NFe já foi enviado uma vez."
                                });
                            }
                        }
                        else
                        {
                            xmlResult.Add(new XmlUploadResultDTO
                            {
                                XmlFileName = formFile.FileName,
                                XmlResult = result
                            });
                        }
                    }
                    else
                    {
                        xmlResult.Add(new XmlUploadResultDTO
                        {
                            XmlFileName = formFile.FileName,
                            XmlResult = "Arquivo vazio"
                        });
                    }
                }
            }
            catch
            {
                return null!;
            }
            return xmlResult;
        }

        public string ValidateXmlNfe(string xmlContent, out string key)
        {
            key = "";
            try
            {
                XmlDocument doc = new XmlDocument();
                doc.LoadXml(xmlContent);

                XmlNode xmlNfeContentNode = doc.DocumentElement!;
                string nfeJson = JsonConvert.SerializeXmlNode(xmlNfeContentNode);
                var nfe = BsonSerializer.Deserialize<BsonDocument>(nfeJson);

                var ide = nfe.GetValue("nfeProc").AsBsonDocument.GetValue("NFe").AsBsonDocument.GetValue("infNFe").AsBsonDocument.GetValue("ide").AsBsonDocument;
                var cUF = ide.GetValue("cUF").AsString;
                var nNF = ide.GetValue("nNF").AsString;
                var tpAmb = ide.GetValue("tpAmb").AsString;

                string CNPJ = nfe.GetValue("nfeProc").AsBsonDocument.GetValue("NFe").AsBsonDocument.GetValue("infNFe").AsBsonDocument.GetValue("emit").AsBsonDocument.GetValue("CNPJ").AsString; ;

                var infProt = nfe.GetValue("nfeProc").AsBsonDocument.GetValue("protNFe").AsBsonDocument.GetValue("infProt").AsBsonDocument;
                var chNFe = infProt.GetValue("chNFe").AsString;
                var nProt = infProt.GetValue("nProt").AsString;
                var cStat = infProt.GetValue("cStat").AsString;

                if (chNFe.Length != 44)
                    return "Rejeitado: erro na chave da NFe (chNFe).";
                else if (nProt.Length != 15)
                    return "Rejeitado: erro no número do protocolo (nProt).";
                else if (cStat != "100")
                    return "Rejeitado: cStat não é 100";
                else if (chNFe.Substring(0, 2) != nProt.Substring(1, 2))
                    return "Rejeitado: erro na chave (chNFe) em relação ao protocolo (infProt->nProt) - Estado";
                else if (chNFe.Substring(0, 2) != cUF)
                    return "Rejeitado: erro na chave (chNFe) em relação ao estado (ide->cUF)";
                else if (Convert.ToInt32(chNFe.Substring(25, 9)) != Convert.ToInt32(nNF))
                    return "Rejeitado: erro na chave (chNFe) em relação ao número da nota fiscal (ide->cNF)";
                else if (chNFe.Substring(6, 14) != CNPJ)
                    return "Rejeitado: erro na chave (chNFe) em relação ao CNPJ do emitente (emit->CNPJ)";
                else if (tpAmb != "1")
                    return "Rejeitado: Tipo de ambiente não é produção (ide->tpAmb)";

                key = chNFe;

                return "ok";
            }
            catch(Exception ex)
            {
                return ex.Message;
            }
        }


        public string LoadContentFile(IFormFile formFile)
        {
            try
            {
                using var fileStream = formFile.OpenReadStream();
                byte[] xmlContent = new byte[formFile.Length];
                fileStream.Read(xmlContent, 0, (int)formFile.Length);

                return System.Text.Encoding.Default.GetString(xmlContent);
            }
            catch
            {
                return null!;
            }

        }

        public async Task<bool> InsertIntoNfeXml(NfeXmlEntity NfeXml)
        {
            var nfeService = new NfeXmlService(_dbMongo);
            await nfeService.AddAsync(NfeXml);

            return true;
        }

        public async Task<string> WriteFile(IFormFile file, string pathStorage)
        {
            string filename = file.FileName;
            try
            {
                // filename = DateTime.Now.Ticks.ToString() + extension; // gerar nome aleatório

                var exactpath = Path.Combine(pathStorage, filename);

                using var stream = new FileStream(exactpath, FileMode.Create);
                await file.CopyToAsync(stream);
            }
            catch (Exception ex)
            {
                return ex.Message;
            }

            return "ok";
        }

        public async Task<NfeXmlDTO> GetAsync(string chNFe)
        {
            var nfeService = new NfeXmlService(_dbMongo);
            var nfe = await nfeService.GetAsync(chNFe);

            return nfe;
        }

        public async Task<bool> ExistChNFeAsync(string chNFe)
        {
            var nfeService = new NfeXmlService(_dbMongo);
            var result = await nfeService.ExistChNFeAsync(chNFe);

            return result;
        }

        public async Task<NfeXmlAdmBasicDTO> GetAllAsync(DateTime dataDe, DateTime dataAte)
        {
            var nfeService = new NfeXmlService(_dbMongo);
            var nfes = await nfeService.GetAllAsync(dataDe, dataAte);

            var nfeAdm = new NfeXmlAdmBasicDTO();
            var nfeTotal = new NfeXmlAdmBasicTotalDTO();
            var nfeItensList = new List<NfeXmlAdmBasicItemDTO>();

            int qtdeNFe = 0;
            decimal valorTotalNF = 0;
            decimal valorTotalIcms = 0;
            decimal valorTotalPis = 0;
            decimal valorTotalCofins = 0;
            decimal valorTotalIPI = 0;

            foreach (var item in nfes)
            {
                var nfe = BsonSerializer.Deserialize<BsonDocument>(item.ToJson());

                 var infProt = nfe.GetValue("nfeProc").AsBsonDocument.GetValue("protNFe").AsBsonDocument.GetValue("infProt");

                var ide = nfe.GetValue("nfeProc").AsBsonDocument.GetValue("NFe").AsBsonDocument.GetValue("infNFe").AsBsonDocument.GetValue("ide");

                var dest = nfe.GetValue("nfeProc").AsBsonDocument.GetValue("NFe").AsBsonDocument.GetValue("infNFe").AsBsonDocument.GetValue("dest"); 
                var total = nfe.GetValue("nfeProc").AsBsonDocument.GetValue("NFe").AsBsonDocument.GetValue("infNFe").AsBsonDocument.GetValue("total").AsBsonDocument.GetValue("ICMSTot");

                var CnpjCpf = "";
                try {CnpjCpf = dest.AsBsonDocument.GetValue("CNPJ").AsString;} 
                catch {CnpjCpf = dest.AsBsonDocument.GetValue("CPF").AsString;}

                nfeItensList.Add(new NfeXmlAdmBasicItemDTO
                {
                    ChNFe = infProt.AsBsonDocument.GetValue("chNFe").AsString,
                    DataEmissao = ide.AsBsonDocument.GetValue("dhEmi").AsString.Substring(0,10),
                    CnpjCpf = CnpjCpf,
                    NomeDestinatario = dest.AsBsonDocument.GetValue("xNome").AsString,
                    NaturezaOperacao = ide.AsBsonDocument.GetValue("natOp").AsString,
                    ValorTotalNF = Convert.ToDecimal(total.AsBsonDocument.GetValue("vNF").AsString.Replace(".",",")),
                    ValorTotalIcms = Convert.ToDecimal(total.AsBsonDocument.GetValue("vICMS").AsString.Replace(".", ",")),
                    ValorTotalPis = Convert.ToDecimal(total.AsBsonDocument.GetValue("vPIS").AsString.Replace(".", ",")),
                    ValorTotalCofins = Convert.ToDecimal(total.AsBsonDocument.GetValue("vCOFINS").AsString.Replace(".", ",")),
                    ValorTotalIPI = Convert.ToDecimal(total.AsBsonDocument.GetValue("vIPI").AsString.Replace(".", ",")),
                    Status = infProt.AsBsonDocument.GetValue("cStat").AsString
                });

                qtdeNFe++;

                valorTotalNF += Convert.ToDecimal(total.AsBsonDocument.GetValue("vNF").AsString.Replace(".", ","));
                valorTotalIcms = Convert.ToDecimal(total.AsBsonDocument.GetValue("vICMS").AsString.Replace(".", ","));
                valorTotalPis = Convert.ToDecimal(total.AsBsonDocument.GetValue("vPIS").AsString.Replace(".", ","));
                valorTotalCofins = Convert.ToDecimal(total.AsBsonDocument.GetValue("vCOFINS").AsString.Replace(".", ","));
                valorTotalIPI = Convert.ToDecimal(total.AsBsonDocument.GetValue("vIPI").AsString.Replace(".", ","));


            }

            nfeTotal.QtdeNFe = qtdeNFe;
            nfeTotal.ValorTotalNF = valorTotalNF;
            nfeTotal.ValorTotalIcms = valorTotalIcms;
            nfeTotal.ValorTotalPis = valorTotalPis;
            nfeTotal.ValorTotalCofins = valorTotalCofins;
            nfeTotal.ValorTotalIPI = valorTotalIPI;

            nfeAdm.Total = nfeTotal;
            nfeAdm.Itens = nfeItensList;

            return nfeAdm;
        }


    }
}
