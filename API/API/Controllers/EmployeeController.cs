﻿using API.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmployeeController : ControllerBase
    {
        private readonly EmployeeDbContext _context;
        private readonly IWebHostEnvironment _webHostEnvironment;
        public EmployeeController(EmployeeDbContext context, IWebHostEnvironment webHostEnvironment)
        {
            _context = context;
            _webHostEnvironment = webHostEnvironment;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Employee>>> GetEmployees()
        {
            // hata durumunu test etmek için 
            //throw new Exception("Simulated server error");
            
            await Task.Delay(500);

            var data = await _context.Employees
                .Select(x => new Employee
                {
                    Id = x.Id,
                    Name = x.Name,
                    Occupation = x.Occupation,
                    ImageName = x.ImageName,
                    ImageSrc = String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, x.ImageName)
                })
                .ToListAsync();

            return data;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Employee>> GetEmployee(int id)
        {



            var employee = await _context.Employees.FindAsync(id);

            if (employee == null)
            {
                return NotFound();
            }

            return employee;
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutEmployee(int id, [FromForm] Employee employee)
        {
            if (id != employee.Id)
            {
                return BadRequest();
            }


            if(employee.ImageFile!= null)
            {
                DeleteImage(employee.ImageName);
                employee.ImageName = await SaveImage(employee.ImageFile);
            }

            _context.Entry(employee).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EmployeeExist(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }



        [HttpPost]
        public async Task<ActionResult<Employee>> PostEmployee([FromForm] Employee employee)
        {
            employee.ImageName = await SaveImage(employee.ImageFile);
           _context.Employees.Add(employee);
            await _context.SaveChangesAsync();

            return StatusCode(201);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Employee>> DeleteEmployee(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if(employee == null)
            {
                return NotFound();
            }
            DeleteImage(employee.ImageName);
            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();

            return employee;
        }

        private bool EmployeeExist(int id)
        {
            return _context.Employees.Any(e => e.Id == id);
        }

        [NonAction]
        public async Task<string> SaveImage(IFormFile formFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(formFile.FileName).Take(10).ToArray()).Replace(' ','-');
            imageName = imageName + DateTime.Now.ToString("yyyyy-MM-dd") + Path.GetExtension(formFile.FileName);
            
            var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images",imageName);

            using(var fileStream = new FileStream(imagePath, FileMode.Create))
            {
                await  formFile.CopyToAsync(fileStream);
            }

            return imageName;
        }

        [NonAction]
        public void DeleteImage(string imageName) 
        {
            var imagePath = Path.Combine(_webHostEnvironment.ContentRootPath, "Images", imageName);
            if(System.IO.File.Exists(imagePath))
            {
                System.IO.File.Delete(imagePath);
            }
        }


    }
}
