<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# React Native Mobile App - Hangout Social Platform

This is a React Native mobile application built with Expo for connecting people and organizing social hangouts.

## Tech Stack
- React Native with Expo
- React Navigation (Stack & Bottom Tab navigation)
- Expo Vector Icons for iconography
- JavaScript/ES6+

## Project Structure
- `src/screens/` - Main application screens (Login, Signup, Home, ViewHangouts, FindPeople, Profile)
- `src/navigation/` - Navigation configuration and components
- `src/components/` - Reusable UI components

## Key Features
- Authentication screens (Login/Signup) with simple validation
- Tab-based navigation with 4 main screens
- Home dashboard with quick actions and recent hangouts
- Hangout browsing with search and filtering
- People discovery with interest-based matching
- User profile management with editable information

## Coding Guidelines
- Use functional components with React hooks
- Follow React Native styling conventions
- Maintain consistent UI/UX patterns across screens
- Use proper error handling and user feedback (Alerts)
- Keep components modular and reusable
- Use meaningful variable and function names

## Authentication Note
Currently implements mock authentication - any valid email/password combination will authenticate users. This is intentional for the template/demo phase.
