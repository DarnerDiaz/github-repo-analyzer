import { GoogleGenerativeAI } from '@google/generative-ai';
import { ChatContextData } from '@/types';

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '');

export interface ChatRequest {
  message: string;
  context: Partial<ChatContextData>;
  conversationHistory: Array<{ role: string; content: string }>;
}

export interface ChatResponse {
  response: string;
  thinking?: string;
}

export async function sendMessageToGemini(
  request: ChatRequest
): Promise<ChatResponse> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build context from repository information
    let systemPrompt = `You are an expert code analyst. You help users understand and analyze GitHub repositories.
When asked about code, always be specific and provide code examples when relevant.
`;

    if (request.context.repository) {
      systemPrompt += `
Current Repository: ${request.context.repository.owner}/${request.context.repository.repo}
Description: ${request.context.repository.description}
Primary Language: ${request.context.repository.language}
Stars: ${request.context.repository.stars}
`;
    }

    if (request.context.analysis) {
      systemPrompt += `
Repository Analysis:
- Main Languages: ${request.context.analysis.mainLanguages.join(', ')}
- Key Files: ${request.context.analysis.keyFiles.join(', ')}
- Summary: ${request.context.analysis.summary}
`;
    }

    // Build message history
    const systemMessage = {
      role: 'user',
      parts: [
        {
          text: systemPrompt,
        },
      ],
    };

    const chat = model.startChat({
      history: [
        ...request.conversationHistory.map((msg) => ({
          role: msg.role as 'user' | 'model',
          parts: [{ text: msg.content }],
        })),
      ],
    });

    const result = await chat.sendMessage(request.message);
    const response = result.response.text();

    return {
      response,
    };
  } catch (error) {
    console.error('Error sending message to Gemini:', error);
    throw new Error('Failed to get response from AI model');
  }
}

export async function generateDocumentation(
  repositoryContent: string,
  repoName: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Generate comprehensive documentation for the following GitHub repository: ${repoName}

Repository Content Summary:
${repositoryContent}

Please generate documentation that includes:
1. Project Overview
2. Key Features
3. Installation Instructions
4. Usage Examples
5. Architecture Overview
6. Contributing Guidelines

Format the output as markdown.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating documentation:', error);
    throw new Error('Failed to generate documentation');
  }
}

export async function generateSummary(
  repositoryContent: string,
  repoName: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const prompt = `Provide a concise but comprehensive summary of the following GitHub repository: ${repoName}

Repository Content:
${repositoryContent}

Focus on:
- Main purpose and functionality
- Technology stack
- Key strengths
- Potential use cases

Keep the summary to 2-3 paragraphs.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary');
  }
}
