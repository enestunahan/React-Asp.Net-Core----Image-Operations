﻿using System.ComponentModel.DataAnnotations.Schema;

namespace API.Models
{
    public class Employee
    {
        public int Id { get; set; }

        [Column(TypeName ="nvarchar(50)")]
        public string Name { get; set; }

        [Column(TypeName = "nvarchar(50)")]
        public string Occupation { get; set; }

        [Column(TypeName = "nvarchar(100)")]
        public string ImageName { get; set; }
    }
}