# CV Generator Project

## Project Overview
This project is a web-based application that allows users to create professional, ATS-friendly CVs and download them as PDF files. The system prioritizes clean formatting, structured layouts, and readability to ensure compatibility with Applicant Tracking Systems (ATS).

## Purpose
- Provide a simple and intuitive way for users to generate CVs.
- Ensure generated CVs are **fully optimized for ATS parsing**, with proper headings, bullet points, and clear sections.
- Allow dynamic selection of templates and professional color schemes without compromising ATS readability.

## Technologies
- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** PHP  
- **PDF Generation:** PHP-based library for rendering HTML to PDF (e.g., mPDF or Dompdf)  
- **Optional Libraries:** Tailwind CSS for styling, JS libraries for form handling and live preview.

## Features
- User-friendly form to input personal, educational, and professional information.
- Predefined **ATS-compliant templates** with customizable color palettes.
- Real-time preview of the CV before generation.
- Export CV as a downloadable PDF file.
- Ability to switch between multiple professional templates without affecting ATS compliance.

## Architecture
- **Frontend:** Handles data collection and optional live preview.
- **Backend:** Processes form data, injects it into HTML templates, and generates PDF.
- **Templates & Styles:** Centralized HTML/CSS templates designed to be **machine-readable** by ATS software.

## ATS Compliance Considerations
- Proper semantic structure: clear headings for each section (Education, Experience, Skills).  
- Use of standard fonts and formatting (avoiding images for text, complex tables, or graphics).  
- Consistent bullet points and spacing for parsing accuracy.  
- Avoidance of decorative elements that may confuse ATS parsing.

## Color Palette System
- Each CV template uses professional color palettes.
- Palettes include: primary, secondary, accent, background, text, and highlight colors.
- Color choices enhance readability for humans but **do not interfere with ATS parsing**.

## Usage
- The project is intended for educational purposes.
- Deployment to production or public usage is not recommended.
- No guarantees on performance, security, or reliability outside the educational environment.

## Project Goals
- Gain practical experience in full-stack web development.
- Learn to integrate frontend forms with backend PDF generation.
- Create **professional, ATS-optimized CV templates** ready for job applications.