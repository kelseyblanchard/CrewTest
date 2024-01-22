from flask import Flask
from flask import request
from flask_cors import CORS
from crewai import Agent, Task, Crew
from langchain.llms import Ollama
from langchain.tools import DuckDuckGoSearchRun
from langchain.agents import load_tools
import json

ollama_llm = Ollama(model="openhermes")

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello():
    return 'hi'

@app.route("/api", methods=['GET', 'POST'])
def input():
    if request.method == 'GET':
        return "GET"
    else:
        print(request.data)
        # return json.loads(request.data)
        input_data = json.loads(request.data)
        debug_info = []  # Collect debugging information
        try:
            agents = {}
            tasks = []
            # search_tool = DuckDuckGoSearchRun()

            inputAgents = input_data['agents']
            inputTasks = input_data['tasks']

            for agent in inputAgents:
                role = agent['role']
                goal = agent['goal']
                backstory = agent['backstory']
                print(f"[AGENT]: {role}")
                agents[role] = Agent(
                    role=role,
                    goal=goal,
                    backstory=backstory,
                    verbose=True,
                    allow_delegation=False,
                    llm=ollama_llm
                )
                debug_info.append(f"Created Agent: {role}")

            for task in inputTasks:
                taskRole = task['role']
                taskDescription = task['description']
                print(f"[TASK]: {taskRole}")
                taskAgent = agents.get(taskRole)
                if taskAgent:
                    tasks.append(Task(description=taskDescription, agent=taskAgent))
                    debug_info.append(f"Created Task for {taskRole}: {taskDescription}")

            if not agents or not tasks:
                debug_str = "\n".join(debug_info)
                return f"No valid agents or tasks were created. Please check the input format.\nDebug info:\n{debug_str}"
            print(agents)
            crew = Crew(agents=list(agents.values()), tasks=tasks, verbose=2)
            result = crew.kickoff()
            return result

        except Exception as e:
            debug_str = "\n".join(debug_info)
            return f"Error: {e}\nDebug info:\n{debug_str}"

if __name__ == "__main__":
    app.run()
