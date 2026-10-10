
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const jobs = [
    {
      title: "Frontend Developer",
      company: "TechNova Solutions",
      location: "Bangalore",
      jobType: "Full Time",
      salary: "₹5–8 LPA",
      description: "Build responsive and user-friendly web applications.",
      requirements: "HTML, CSS, JavaScript, React",
    },
    {
      title: "Python Developer",
      company: "CodeCraft",
      location: "Hyderabad",
      jobType: "Full Time",
      salary: "₹4–7 LPA",
      description: "Develop and maintain applications using Python.",
      requirements: "Python, SQL, problem-solving",
    },
    {
      title: "Data Analyst Intern",
      company: "DataWorks",
      location: "Remote",
      jobType: "Internship",
      salary: "₹15K–₹25K/month",
      description: "Analyze datasets and prepare useful reports.",
      requirements: "Python, Excel, SQL",
    },
    {
      title: "Java Developer",
      company: "InnovateTech",
      location: "Pune",
      jobType: "Full Time",
      salary: "₹6–10 LPA",
      description: "Develop reliable applications using Java.",
      requirements: "Java, OOP, SQL",
    },
  ];

  for (const job of jobs) {
    await prisma.job.upsert({
      where: {
        id: jobs.indexOf(job) + 1,
      },
      update: job,
      create: job,
    });
  }

  console.log("CareerHub sample jobs added!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
