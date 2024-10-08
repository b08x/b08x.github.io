import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Database, Server, Code, Cog } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const components = [
  { id: 'graylog', name: 'Graylog', category: 'Core Services', icon: AlertCircle, deploymentTime: 15 },
  { id: 'postgres', name: 'Postgres/PGvector', category: 'Core Services', icon: Database, deploymentTime: 20 },
  { id: 'redis', name: 'Redis', category: 'Core Services', icon: Database, deploymentTime: 10 },
  { id: 'chromadb', name: 'ChromaDB', category: 'Core Services', icon: Database, deploymentTime: 12 },
  { id: 'flowise', name: 'Flowise', category: 'Core Services', icon: Server, deploymentTime: 18 },
  { id: 'dify', name: 'Dify.ai', category: 'Core Services', icon: Server, deploymentTime: 22 },
  { id: 'ollama', name: 'Ollama', category: 'Core Services', icon: Server, deploymentTime: 25 },
  { id: 'localai', name: 'LocalAI', category: 'Core Services', icon: Server, deploymentTime: 30 },
  { id: 'evaluation', name: 'Evaluation Frameworks', category: 'Development Tools', icon: Code, deploymentTime: 8 },
  { id: 'sillytavern', name: 'Customized SillyTavern', category: 'Development Tools', icon: Code, deploymentTime: 14 },
  { id: 'jupyter', name: 'Jupyter Labs', category: 'Development Tools', icon: Code, deploymentTime: 16 },
  { id: 'ruby', name: 'Ruby Environment', category: 'Programming Environments', icon: Code, deploymentTime: 10 },
  { id: 'python', name: 'Python Environment', category: 'Programming Environments', icon: Code, deploymentTime: 12 },
  { id: 'devops', name: 'DevOps Roles', category: 'DevOps', icon: Cog, deploymentTime: 25 },
];

const AnsibleCollectionVisualizer = () => {
  const [selectedComponents, setSelectedComponents] = useState([]);
  const [currentStep, setCurrentStep] = useState('selection');
  const [deploymentProgress, setDeploymentProgress] = useState({});

  const handleComponentToggle = (componentId) => {
    setSelectedComponents(prev => 
      prev.includes(componentId)
        ? prev.filter(id => id !== componentId)
        : [...prev, componentId]
    );
  };

  const handleDeploy = () => {
    setCurrentStep('deployment');
    setDeploymentProgress(
      selectedComponents.reduce((acc, id) => ({ ...acc, [id]: 0 }), {})
    );
  };

  useEffect(() => {
    if (currentStep === 'deployment') {
      const intervals = selectedComponents.map(componentId => {
        const component = components.find(c => c.id === componentId);
        return setInterval(() => {
          setDeploymentProgress(prev => ({
            ...prev,
            [componentId]: Math.min(prev[componentId] + 100 / component.deploymentTime, 100)
          }));
        }, 1000);
      });

      return () => intervals.forEach(clearInterval);
    }
  }, [currentStep, selectedComponents]);

  const renderComponentSelection = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {components.map(component => (
        <Card key={component.id} className="flex flex-col transition-transform hover:scale-105">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {component.name}
            </CardTitle>
            <component.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={component.id}
                checked={selectedComponents.includes(component.id)}
                onCheckedChange={() => handleComponentToggle(component.id)}
              />
              <label
                htmlFor={component.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include in deployment
              </label>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderDeploymentSimulation = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Deployment in Progress</CardTitle>
          <CardDescription>Simulating Ansible playbook execution</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-4">
            {selectedComponents.map(componentId => {
              const component = components.find(c => c.id === componentId);
              return (
                <li key={componentId} className="text-sm">
                  <div className="flex justify-between mb-1">
                    <span>Deploying {component.name}...</span>
                    <span>{Math.round(deploymentProgress[componentId])}%</span>
                  </div>
                  <Progress value={deploymentProgress[componentId]} className="w-full" />
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
      <Button onClick={() => setCurrentStep('selection')} className="mt-4">
        Back to Component Selection
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Ansible Collection Visualizer</h1>
      {currentStep === 'selection' ? (
        <>
          {renderComponentSelection()}
          <div className="mt-4">
            <Button onClick={handleDeploy} disabled={selectedComponents.length === 0} className="transition-all hover:bg-blue-600">
              Deploy Selected Components
            </Button>
          </div>
        </>
      ) : (
        renderDeploymentSimulation()
      )}
    </div>
  );
};

export default AnsibleCollectionVisualizer;
