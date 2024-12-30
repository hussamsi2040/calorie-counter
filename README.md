# Smart Calorie Counter

A modern web application that uses AI to analyze food through images and text descriptions, providing accurate calorie and nutritional information.

## Features

- 📸 **Image-Based Food Analysis**
  - Take photos directly or upload from gallery
  - AI-powered food recognition
  - Accurate calorie estimation based on USDA database

- 🎙️ **Voice/Text Food Logging**
  - Natural language food description
  - Voice input with real-time transcription
  - Continuous voice mode for hands-free logging

- 🔍 **Nutritional Analysis**
  - Detailed calorie breakdown
  - Macronutrient information (protein, carbs, fat)
  - Portion size estimation
  - Evidence-based calculations using USDA standards

- 📱 **Mobile-Friendly Design**
  - Responsive interface
  - Touch-optimized controls
  - Works on all modern devices

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Gemini API key from Google AI Studio

### Installation

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd calorie-counter
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_GEMINI_API_KEY=your_api_key_here
   ```
   Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Technology Stack

- **Frontend**: Next.js 14 with React
- **Styling**: Tailwind CSS
- **AI**: Google Gemini API
- **UI Components**: Headless UI
- **Icons**: Heroicons

## Browser Support

The application works best in modern browsers that support:
- Web Speech API (for voice input)
- Modern CSS features
- JavaScript ES6+

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.


