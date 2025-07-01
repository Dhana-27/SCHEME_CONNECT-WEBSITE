import React from 'react';
import { CheckCircle, Circle, ArrowRight, User, Search, FileText, Send } from 'lucide-react';
import { WorkflowStep } from '../types';

interface DynamicWorkflowProps {
  steps: WorkflowStep[];
  onStepClick: (stepId: string) => void;
}

export const DynamicWorkflow: React.FC<DynamicWorkflowProps> = ({ steps, onStepClick }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Application Journey</h3>
      
      <div className="space-y-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {step.completed ? (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
              ) : step.current ? (
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center animate-pulse">
                  <Circle className="h-5 w-5 text-white" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <Circle className="h-5 w-5 text-gray-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <button
                onClick={() => onStepClick(step.id)}
                className={`text-left w-full p-3 rounded-lg transition-colors ${
                  step.current 
                    ? 'bg-purple-50 border border-purple-200' 
                    : step.completed 
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                }`}
              >
                <h4 className={`font-medium ${
                  step.current ? 'text-purple-900' : 
                  step.completed ? 'text-green-900' : 'text-gray-700'
                }`}>
                  {step.title}
                </h4>
                <p className={`text-sm mt-1 ${
                  step.current ? 'text-purple-600' : 
                  step.completed ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {step.description}
                </p>
              </button>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-shrink-0">
                <ArrowRight className="h-4 w-4 text-gray-400" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <p className="text-sm font-medium text-purple-900">Dynamic Workflow Active</p>
        </div>
        <p className="text-xs text-purple-700">
          Your workflow adapts based on your profile, selected schemes, and progress. 
          Steps may change dynamically to optimize your application process.
        </p>
      </div>
    </div>
  );
};