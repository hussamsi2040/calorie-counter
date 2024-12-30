import { GoogleGenerativeAI } from '@google/generative-ai';

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error('Missing NEXT_PUBLIC_GEMINI_API_KEY environment variable');
}

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export interface FoodAnalysisResult {
  items: Array<{
    name: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    portion?: string;
  }>;
  totalCalories: number;
}

const FOOD_ANALYSIS_PROMPT = `
You are a precise clinical nutritionist using evidence-based calculations. Analyze the provided input and return ONLY a JSON object (no markdown formatting, no backticks) with this exact structure:
{
  "items": [
    {
      "name": "food item name",
      "calories": number (estimated calories),
      "protein": number (grams, optional),
      "carbs": number (grams, optional),
      "fat": number (grams, optional),
      "portion": "portion size description (optional)"
    }
  ],
  "totalCalories": number (sum of all items' calories)
}

Follow these strict calculation rules:
1. Base Calculations:
   - 1g protein = 4 calories
   - 1g carbohydrates = 4 calories
   - 1g fat = 9 calories

2. Standard Portion References (USDA):
   Proteins:
   - Chicken breast (skinless): 120 cal/100g
   - Beef (lean): 250 cal/100g
   - Fish (white): 100 cal/100g
   - Eggs: 72 cal/large egg (50g)
   
   Carbohydrates:
   - White rice (cooked): 130 cal/cup (158g)
   - Brown rice (cooked): 216 cal/cup (195g)
   - Bread: 75 cal/slice (26g)
   - Pasta (cooked): 200 cal/cup (140g)
   
   Vegetables & Fruits:
   - Green leafy vegetables: 20-30 cal/cup
   - Potato (baked): 150 cal/medium (173g)
   - Apple: 95 cal/medium (182g)
   - Banana: 105 cal/medium (118g)
   
   Fats & Oils:
   - Olive oil: 120 cal/tbsp (15ml)
   - Butter: 102 cal/tbsp (14g)
   - Avocado: 240 cal/whole (201g)

3. Validation Rules:
   - Total calories must match sum of macronutrients (if provided)
   - Protein rarely exceeds 30g per serving for non-supplements
   - Fat content should align with visible oil/fat in preparation
   - Account for cooking methods:
     * Grilled/baked: minimal added calories
     * Fried: +120 cal/tbsp oil absorbed
     * Sauced: include sauce calories separately

4. Mixed Dish Guidelines:
   - Break down into components
   - List main ingredients separately
   - Include cooking oils/sauces
   - Consider moisture loss in cooking

5. Error Prevention:
   - Round calories to nearest 5
   - Use conservative estimates when uncertain
   - Never exceed 800 calories for single serving
   - Flag unusually high values for review

6. Common Combinations:
   - Sandwich: bread (150 cal) + protein (120-150 cal) + toppings (50-100 cal)
   - Salad base: greens (25 cal) + dressing (120 cal/tbsp)
   - Rice bowl: rice (130 cal/cup) + protein (150 cal) + vegetables (50 cal)

Be precise with names and portions. Always include macronutrients for whole meals.
If exact portion is unclear, use smaller standard serving size.
IMPORTANT: Return ONLY the JSON object, with no additional text or formatting.`;

export async function analyzeImageContent(imageData: ArrayBuffer): Promise<FoodAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = FOOD_ANALYSIS_PROMPT + "\nIdentify and analyze the food items in this image. Return ONLY the JSON.";
    
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: Buffer.from(imageData).toString('base64'),
          mimeType: 'image/jpeg'
        }
      }
    ]);

    const response = await result.response;
    const text = response.text().trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw new Error('Failed to analyze image content');
  }
}

export async function analyzeTextDescription(description: string): Promise<FoodAnalysisResult> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = FOOD_ANALYSIS_PROMPT + "\nAnalyze this food description: " + description + "\nReturn ONLY the JSON.";
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text().trim();
    return JSON.parse(text);
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw new Error('Failed to analyze text description');
  }
} 