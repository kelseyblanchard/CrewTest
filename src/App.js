import logo from './logo.svg';
import './App.css';
import React from 'react';

const createKey = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  // Add random characters
  for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}

const AgentRow = (props) => {
  return (
    <div style={{width: '100%', display: 'inline-block', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', marginBottom: '5px'}}>
      <input value="AGENT" disabled style={{ height: '50px', textAlign: 'center' }} />
      <textarea placeholder="Role" value={props.role} onChange={(e) => props.updateAgent(props.id, 'role', e.target.value)} style={{ height: '50px' }} />
      <textarea placeholder="Goal" value={props.goal} onChange={(e) => props.updateAgent(props.id, 'goal', e.target.value)} style={{ height: '50px' }} />
      <textarea placeholder="Backstory" value={props.backstory} onChange={(e) => props.updateAgent(props.id, 'backstory', e.target.value)} style={{ height: '50px' }} />
      <button onClick={() => props.deleteAgent(props.id)}>Delete Agent</button>
    </div>
  );
}

const TaskRow = (props) => {
  return (
    <div style={{width: '100%', display: 'inline-block', display: 'grid', gridTemplateColumns: '1fr 1fr 2fr 1fr', marginBottom: '5px'}}>
      <input value="TASK" disabled style={{ height: '50px', textAlign: 'center' }} />
      <textarea placeholder="Role" value={props.role} onChange={(e) => props.updateTask(props.id, 'role', e.target.value)} style={{ height: '50px' }} />
      <textarea placeholder="Description" value={props.goal} onChange={(e) => props.updateTask(props.id, 'description', e.target.value)} style={{ height: '50px' }} />
      <button onClick={() => props.deleteTask(props.id)}>Delete Task</button>
    </div>
  );
}

const App = () => {

  const [data, setData] = React.useState("");
  const [input, setInput] = React.useState("");
  const [agents, setAgents] = React.useState([
    {
      role: "Fact Checker",
      goal: "Provide a factual statement about an animal",
      backstory: "Specializes in verifying information about animals",
      id: createKey()
    }
  ]);
  const [tasks, setTasks] = React.useState([
    {
      role: "Fact Checker",
      description: "Provide an interesting factual statement about a specific animal",
      id: createKey()
    }
  ]);

  const addAgent = () => {
    setAgents([...agents, { id: createKey() }])
  }

  const addTask = () => {
    setTasks([...tasks, { id: createKey() }])
  }

  const deleteAgent = (id) => {
    setAgents(agents.filter((agent) => {
      return agent.id !== id
    }))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => {
      return task.id !== id
    }))
  }

  const updateAgent = (id, prop, value) => {
    let updatedAgents = [];
    for (let agent of agents) {
      if (agent.id === id) {
        let updatedAgent = {
          role: agent.role,
          goal: agent.goal,
          backstory: agent.backstory,
          id: agent.id
        }
        updatedAgent[prop] = value;
        updatedAgents.push(updatedAgent);
      } else {
        updatedAgents.push(agent);
      }
    }
    setAgents(updatedAgents);
  }

  const updateTask = (id, prop, value) => {
    let updatedTasks = [];
    for (let task of tasks) {
      if (task.id === id) {
        let updatedTask = {
          role: task.role,
          description: task.description,
          id: task.id
        }
        updatedTask[prop] = value;
        updatedTasks.push(updatedTask);
      } else {
        updatedTasks.push(task);
      }
    }
    setTasks(updatedTasks);
  }

  const submitData = () => {
    console.log(agents);
    console.log(tasks);
    
    // comment out below then submit it as body data in request with stringify
    // then turn back to json in python

    // const allData = {
    //   agents,
    //   tasks
    // };


    // setData("Loading...");
    // fetch('http://127.0.0.1:5000/api', {
    //     method: "POST", // *GET, POST, PUT, DELETE, etc.
    //     // mode: "no-cors", // no-cors, *cors, same-origin
    //     cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    //     credentials: "omit", // include, *same-origin, omit
    //     headers: {
    //       "Access-Control-Allow-Origin": "*",
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(input)
    // })
    //     .then(response => {
    //       return response.text();
    //     })
    //     .then(response => setData(response))
    //     .catch(err => setData("There was an error."));
  }

  return (
    <div className="App">
      <p></p>
      <textarea type="text" rows={12} value={input} onChange={e => setInput(e.target.value)} style={{width: '600px'}} />
      {agents.map((agent) => (
        <AgentRow role={agent.role} goal={agent.goal} backstory={agent.backstory} id={agent.id} key={agent.id} deleteAgent={deleteAgent} updateAgent={updateAgent} />
      ))}
      <button style={{fontSize: '20'}} onClick={addAgent}>Add Agent +</button>
      {tasks.map((task) => (
        <TaskRow role={task.role} description={task.description} id={task.id} key={task.id} deleteTask={deleteTask} updateTask={updateTask} />
      ))}
      <button style={{fontSize: '20'}} onClick={addTask}>Add Task +</button>
      
      <p></p>
      <button onClick={submitData}>Submit</button>
      <p>{data}</p>
    </div>
  );
}

export default App;
