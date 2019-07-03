using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication;

namespace Game.Application.Account
{
    [Route("/api/[controller]")]
    public class AccountController : Controller
    {
        [HttpGet("login")]
        public async Task<IActionResult> Login()
        {
            var auth = await HttpContext.AuthenticateAsync("Google");

            if (User.Identity.IsAuthenticated)
            {
                return Ok();
            }
            else
            {
                return Challenge();
            }
        }
    }
}
