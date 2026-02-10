const API_KEY = import.meta.env.ANTHROPIC_API_KEY || '';
const API_URL = 'https://api.anthropic.com/v1/messages';

export class LLMService {
  public async chat(userInput: string, systemContext: string): Promise<string> {
    if (!API_KEY) {
      // biome-ignore lint/suspicious/noConsole: debugging
      console.warn('Chave de API do Claude (ANTHROPIC_API_KEY) não configurada.');
      // return "Chave de API não configurada.";
    }

    const systemPrompt = `
      Você é um assistente especialista do sistema Bykonz.
      Receberá um contexto filtrado com as rotas mais relevantes para a pergunta do usuário.
      
      Formato do Contexto:
      - Route: Título (ID)
        Path: /caminho
        Desc: Descrição e capacidades
        Params: Esquema de parâmetros (se relevante)

      Objetivo:
      1. Se o usuário quiser navegar, analise o schema e extraia os parâmetros.
      2. Se for uma dúvida, use a Descrição para responder.
      3. Seja conciso e direto.
      
      Contexto Relevante:
      ${systemContext}
    `;

    try {
      if (!API_KEY) return 'Configuração de API pendente.';

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerously-allow-browser': 'true',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307', // Updated model name if needed, or keep existing
          max_tokens: 300,
          messages: [
            {
              role: 'user',
              content: `${systemPrompt}\n\nPergunta do Usuário:\n${userInput}`,
            },
          ],
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro na API do Claude: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: debugging
      console.error('Erro na chamada do LLM (Claude):', error);
      throw error;
    }
  }
}
