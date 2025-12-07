import Agent from "./agent.model";

// Service to add or update agents
const addAgents = async (agents: {
  name: string;
  number: string;
  email: string;
}): Promise<any> => {
  try {
    // Then create new agents
    const createdAgents = await Agent.create(agents);
    return createdAgents;
  } catch (error) {
    throw error;
  }
};

// Service to get agents
const getAgents = async (): Promise<any> => {
  try {
    const agents = await Agent.find();
    return { agents };
  } catch (error) {
    throw error;
  }
};

export default {
  addAgents,
  getAgents,
};
