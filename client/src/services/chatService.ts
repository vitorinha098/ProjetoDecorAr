import type { Furniture } from "@shared/schema";

export interface ChatCommand {
  type: 'add_furniture' | 'remove_furniture' | 'move_furniture' | 'list_furniture';
  data?: any;
}

export interface ChatResponse {
  message: string;
  command?: ChatCommand;
  success?: boolean;
}

// Função para processar comandos do chatbot
export function processChatCommand(message: string, furnitureList: Furniture[]): ChatResponse | null {
  const lowerMessage = message.toLowerCase();
  
  // Comando para adicionar móvel
  if (lowerMessage.includes('adiciona') || lowerMessage.includes('coloca') || lowerMessage.includes('põe')) {
    // Extrair nome do móvel
    const furnitureName = extractFurnitureName(lowerMessage, furnitureList);
    if (furnitureName) {
      return {
        message: `A adicionar ${furnitureName} ao seu projeto...`,
        command: {
          type: 'add_furniture',
          data: { furnitureName }
        },
        success: true
      };
    }
  }
  
  // Comando para remover móvel
  if (lowerMessage.includes('remove') || lowerMessage.includes('apaga') || lowerMessage.includes('elimina')) {
    const furnitureName = extractFurnitureName(lowerMessage, furnitureList);
    if (furnitureName) {
      return {
        message: `A remover ${furnitureName} do seu projeto...`,
        command: {
          type: 'remove_furniture',
          data: { furnitureName }
        },
        success: true
      };
    }
  }
  
  // Comando para listar móveis
  if (lowerMessage.includes('lista') || lowerMessage.includes('mostra') || lowerMessage.includes('quais')) {
    return {
      message: "A listar móveis disponíveis...",
      command: {
        type: 'list_furniture'
      },
      success: true
    };
  }
  
  return null;
}

// Função para extrair o nome do móvel da mensagem
function extractFurnitureName(message: string, furnitureList: Furniture[]): string | null {
  // Procurar por nomes de móveis na mensagem
  for (const furniture of furnitureList) {
    if (message.includes(furniture.name.toLowerCase())) {
      return furniture.name;
    }
  }
  
  // Procurar por categorias
  const categories = ['cama', 'secretária', 'lâmpada', 'jarro', 'cesto', 'espelho', 'planta', 'roupeiro'];
  for (const category of categories) {
    if (message.includes(category)) {
      // Encontrar o primeiro móvel dessa categoria
      const furniture = furnitureList.find(f => 
        f.category === category || f.name.toLowerCase().includes(category)
      );
      if (furniture) {
        return furniture.name;
      }
    }
  }
  
  return null;
}

// Função para encontrar móvel por nome
export function findFurnitureByName(name: string, furnitureList: Furniture[]): Furniture | null {
  return furnitureList.find(f => 
    f.name.toLowerCase() === name.toLowerCase() || 
    f.name.toLowerCase().includes(name.toLowerCase()) ||
    name.toLowerCase().includes(f.name.toLowerCase())
  ) || null;
}