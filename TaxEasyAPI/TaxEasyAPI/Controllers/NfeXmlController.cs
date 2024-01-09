using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TaxFacileAPI.Aplication.Interfaces;
using TaxFacileAPI.Aplication.Services;

namespace TaxFacileAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NFeXmlController : ControllerBase
    {
        private readonly INfeXmlService _xmlNfeService;
        
       public NFeXmlController(INfeXmlService xmlNfeService)
        {
            _xmlNfeService = xmlNfeService;
        }

        [HttpGet]
        [Route("ExistNFeByChNFe")]
        public async Task<bool> ExistNFeByChNFe(string chNFe)
        {
            return await _xmlNfeService.ExistChNFeAsync(chNFe);
        }

        [HttpGet]
        [Route("GetByChNFe")]
        public async Task<IActionResult> GetAsync(string chNFe)
        {
            var nfeXmlModel=  await _xmlNfeService.GetAsync(chNFe);
          //  var nfeXmlOutput = _mapper.Map<NfeXmlOutput>(nfeXmlModel);

            return Ok(nfeXmlModel);
        }

        [HttpGet]
        [Route("GetAllNFeByDate")]
        public async Task<IActionResult> GetAllAsync([FromQuery] DateTime dataDe, [FromQuery] DateTime dataAte)
        {
            var result = await _xmlNfeService.GetAllAsync(dataDe, dataAte);

            return Ok(result);

            //var nfeXmlOutput = _mapper.Map<NfeXmlOutput>(nfeXmlModel);
        }


        [HttpDelete]
        [Route("DeleteAllNFe")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<bool> DeleteAllNFeAsync()
        {
            return await _xmlNfeService.DeleteAllNFeAsync();
        }

        [HttpDelete]
        [Route("DeleteById/{chNFe}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(string), StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> DeleteAsync(string chNFe)
        {
            if(chNFe == null)
                return BadRequest("Nenhuma chave de NFe foi fornecida.");

            var result = await _xmlNfeService.DeleteAsync(chNFe);
            return Ok(result);
        }

    }
}
