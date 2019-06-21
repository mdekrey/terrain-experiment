using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace Game.Application.Settings
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {

        [HttpGet("terrain")]
        public Stream GetTerrainSettings()
        {
            return this.GetType().Assembly.GetManifestResourceStream("Game.Application.GameJS.src.terrainSettingsDto.local.json");
        }
    }
}
