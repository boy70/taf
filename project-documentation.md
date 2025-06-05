# Tafsula - Team Compatibility Analysis Platform Documentation

## Project Overview
Tafsula is a SaaS platform designed to analyze startup team compatibility using the DISC personality model. It helps startups understand their team dynamics and improve collaboration by providing AI-powered insights and compatibility analysis.

## Tech Stack
- Frontend: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- Backend: Next.js API Routes, Server Actions
- Database: MySQL with Prisma ORM
- Authentication: NextAuth.js with Credentials Provider
- AI Integration: Hugging Face API

## User Roles and Authentication
- **SUPERADMIN**: Full access to all data and administrative features.
- **HR Manager**: Access to their startup's team data and compatibility analysis.
- **Employee**: Can take DISC personality tests and view personal results and insights.

Authentication is handled via NextAuth.js using email and password credentials. Passwords are securely hashed with bcrypt. Sessions use JWT strategy, and user roles and startup associations are included in session tokens.

## DISC Personality Test Flow
- Employees take a short DISC personality test consisting of 20 randomized questions.
- Questions and options are stored in the database with mappings to DISC dimensions (D, I, S, C).
- Upon submission, answers are validated and scored to calculate DISC dimension scores.
- Scores are normalized and a dominant DISC type is determined.
- Answers and results are saved in the database.

## AI-Powered Insights
- After test submission, an AI-generated insight is created using the Hugging Face API.
- Insights provide personalized feedback on work style, communication, strengths, and growth areas based on DISC results.
- Insights are saved and retrievable alongside test results.

## Team Compatibility Analysis
- HR Managers and SUPERADMINs can view team compatibility for a startup.
- The system fetches all users with test results for the startup.
- Team compatibility is calculated by analyzing the distribution and average scores of DISC types.
- A balance score indicates how evenly personality types are represented.
- Strengths, weaknesses, and recommendations are generated to help improve team dynamics.

## Database Schema Overview
- **User**: Stores user information, role, password, and startup association.
- **Startup**: Represents a startup company with associated users.
- **Question**: DISC test questions with options and DISC mappings.
- **Answer**: User's selected options for test questions.
- **Result**: Calculated DISC scores and dominant type per user.
- **Insight**: AI-generated personalized feedback text per user.

## Initial Data Seeding
- Creates default users: SUPERADMIN, HR Manager, and sample employees.
- Creates a sample startup and associates users.
- Seeds DISC personality test questions with options and DISC mappings.
- Seeds sample test results and AI insights for demonstration.

## Frontend Overview
- Landing page introduces the platform and explains how it works.
- Role-based dashboards provide access to relevant features.
- Employees can take the DISC test and view results.
- HR Managers can view team compatibility and recommendations.
- Authentication pages for login and registration.

## Summary
Tafsula combines psychological assessment with AI to provide actionable insights for building better startup teams. It leverages modern web technologies and a robust backend to deliver a seamless user experience for different roles within a startup.

---

This documentation provides a comprehensive understanding of the Tafsula project, its features, and how it functions end-to-end.
