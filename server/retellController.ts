import express from 'express';
import Retell from 'retell-sdk';

const router = express.Router();

// Inicializar o cliente do Retell com a API key do ambiente
console.log('API Key carregada:', process.env.RETELL_API_KEY ? 'Sim' : 'Não');
const retellClient = new Retell({
  apiKey: process.env.RETELL_API_KEY || 'sua_api_key_aqui',
});

// Endpoint para registrar uma nova chamada
router.post('/register-call', async (req, res) => {
  try {
    const { agent_id } = req.body;
    
    if (!agent_id) {
      return res.status(400).json({ error: 'agent_id é obrigatório' });
    }

    // Criar uma chamada web com o agente especificado
    const callResponse = await retellClient.call.createWebCall({
      agent_id: agent_id,
    });

    res.json({
      accessToken: callResponse.access_token,
    });
  } catch (error) {
    console.error('Erro ao registrar chamada:', error);
    res.status(500).json({ 
      error: 'Falha ao registrar chamada',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Endpoint para obter detalhes de uma chamada
router.get('/call-details/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    
    if (!callId) {
      return res.status(400).json({ error: 'callId é obrigatório' });
    }

    const callDetails = await retellClient.call.retrieve(callId);
    
    res.json(callDetails);
  } catch (error) {
    console.error('Erro ao obter detalhes da chamada:', error);
    res.status(500).json({ 
      error: 'Falha ao obter detalhes da chamada',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Endpoint para listar agentes disponíveis
router.get('/agents', async (req, res) => {
  try {
    const agents = await retellClient.agent.list();
    res.json(agents);
  } catch (error) {
    console.error('Erro ao listar agentes:', error);
    res.status(500).json({ 
      error: 'Falha ao listar agentes',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Endpoint para criar um novo agente
router.post('/create-agent', async (req, res) => {
  try {
    const { 
      agent_name, 
      voice_id, 
      language, 
      response_engine_type,
      llm_id,
      prompt 
    } = req.body;

    if (!agent_name || !voice_id) {
      return res.status(400).json({ 
        error: 'agent_name e voice_id são obrigatórios' 
      });
    }

    const agentParams = {
      agent_name,
      voice_id,
      language: language || 'pt-BR',
      response_engine: {
        type: response_engine_type || 'retell-llm',
        llm_id: llm_id || 'llm_234sdertfsdsfsdf',
      },
      ...(prompt && { prompt }),
    };

    const agentResponse = await retellClient.agent.create(agentParams);
    
    res.json(agentResponse);
  } catch (error) {
    console.error('Erro ao criar agente:', error);
    res.status(500).json({ 
      error: 'Falha ao criar agente',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Endpoint para atualizar um agente existente
router.put('/update-agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const updateData = req.body;

    if (!agentId) {
      return res.status(400).json({ error: 'agentId é obrigatório' });
    }

    const agentResponse = await retellClient.agent.update(agentId, updateData);
    
    res.json(agentResponse);
  } catch (error) {
    console.error('Erro ao atualizar agente:', error);
    res.status(500).json({ 
      error: 'Falha ao atualizar agente',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

// Endpoint para deletar um agente
router.delete('/delete-agent/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;

    if (!agentId) {
      return res.status(400).json({ error: 'agentId é obrigatório' });
    }

    await retellClient.agent.delete(agentId);
    
    res.json({ success: true, message: 'Agente deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar agente:', error);
    res.status(500).json({ 
      error: 'Falha ao deletar agente',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
});

export default router;