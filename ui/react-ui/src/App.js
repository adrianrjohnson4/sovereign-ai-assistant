import React, { useState } from 'react';
import TaskEntry from './components/Tasks/TaskEntry';
import SecondBrainForm from './components/SecondBrain/SecondBrainForm';
import SecondBrainList from './components/SecondBrain/SecondBrainList';

function App() {
  const [activeTab, setActiveTab] = useState('tasks');


  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h2>Sovereign AI</h2>
      <p>MVP Version</p>
      <div style={{ display: `flex`, gap: `1rem`}}>
        <button onClick={() => setActiveTab('tasks')}>✅ Tasks</button>
        <button onClick={() => setActiveTab('brain')}>🧠 Second Brain</button>
        <button onClick={() => setActiveTab('list')}>📝 Second Brain List</button>
      </div>

      <div style={{ marginTop: `2rem`}}>
        {activeTab === 'tasks' && <TaskEntry />}
        {activeTab === 'brain' && <SecondBrainForm />}
        {activeTab === 'list' && <SecondBrainList />}
      </div>      
    </div>
  )
}

export default App;
