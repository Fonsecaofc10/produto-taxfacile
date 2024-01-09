using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.StaticFiles;
using System.IO;
using System.IO.Compression;
using System.IO.Pipes;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Xml;
using System.Xml.Linq;
using TaxFacileAPI.Aplication.Interfaces;
using static System.Net.Mime.MediaTypeNames;
using static System.Net.WebRequestMethods;

namespace TaxEasyAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class File : ControllerBase
    {
        private readonly string _pathStorage;
        private readonly INfeXmlService _XmlNfeService;

        public File(IConfiguration config, INfeXmlService fileNfeXmlService)
        {
            _pathStorage = config.GetSection("Storage:StoragePath").Value;
            _XmlNfeService = fileNfeXmlService;
        }

        [HttpPost]
        [Route("UploadXmlNfe")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> UploadFile([FromForm] IList<IFormFile> files, CancellationToken cancellationtoken)
        {
            if(files.Count > 50)
                return BadRequest("O lote enviado pode conter no máximo de 50 arquivos");
            else if(files == null)
                return BadRequest("Nenhum arquivo foi recebido para upload.");

            var result = await _XmlNfeService.UploadFileAsync(files, _pathStorage, cancellationtoken);

            if (result != null)
            {
                return Ok(result);
            }
            else
                return BadRequest("Falha ao tentar fazer o upload");
        }


        [HttpGet]
        [Route("DownloadFile")]
        public async Task<IActionResult> DownloadFile(string filename)
        {
            var filepath = Path.Combine(Directory.GetCurrentDirectory(), "Upload\\Files", filename);

            var provider = new FileExtensionContentTypeProvider();
            if (!provider.TryGetContentType(filepath, out var contenttype))
            {
                contenttype = "application/octet-stream";
            }

            var bytes = await System.IO.File.ReadAllBytesAsync(filepath);
            return File(bytes, contenttype, Path.GetFileName(filepath));
        }


        [HttpGet]
        [Route("Test")]
        public string GetTest()
        {
            return "api tax facile response";
        }


        
    }
}