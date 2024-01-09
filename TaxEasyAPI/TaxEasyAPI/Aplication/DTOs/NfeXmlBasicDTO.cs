using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;
using System.Xml;

namespace TaxFacileAPI.Aplication.DTOs
{

    public class NfeXmlAdmBasicDTO
    {
        public NfeXmlAdmBasicTotalDTO? Total { get; set; }
        public List<NfeXmlAdmBasicItemDTO>? Itens { get; set; }
    }


    public class NfeXmlAdmBasicTotalDTO
    {
        public int QtdeNFe { get; set; }
        public decimal ValorTotalNF { get; set; }
        public decimal ValorTotalIcms { get; set; }
        public decimal ValorTotalPis { get; set; }
        public decimal ValorTotalCofins { get; set; }
        public decimal ValorTotalIPI { get; set; }

    }

    public class NfeXmlAdmBasicItemDTO
    {
        public string? ChNFe { get; set; }
        public string? DataEmissao { get; set; }
        public string? CnpjCpf { get; set; }
        public string? NomeDestinatario { get; set; }
        public string? NaturezaOperacao { get; set; }
        public decimal ValorTotalNF { get; set; }
        public decimal ValorTotalIcms { get; set; }
        public decimal ValorTotalPis { get; set; }
        public decimal ValorTotalCofins { get; set; }
        public decimal ValorTotalIPI { get; set; }
        public string Status { get; set; }

    }


}
