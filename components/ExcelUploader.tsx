import React, { useRef } from 'react';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

interface ExcelUploaderProps {
  onFileUpload: (file: File) => void;
  loading: boolean;
  error: string | null;
  schemasCount: number;
}

export const ExcelUploader: React.FC<ExcelUploaderProps> = ({ 
  onFileUpload, 
  loading, 
  error, 
  schemasCount 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && (file.type.includes('sheet') || file.name.endsWith('.xlsx') || file.name.endsWith('.xls'))) {
      onFileUpload(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Excel Data</h3>
        <p className="text-sm text-gray-600">
          Upload your Excel file to dynamically populate schemes and grants
        </p>
      </div>

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-purple-400 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {loading ? (
          <div className="space-y-3">
            <div className="animate-spin mx-auto w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full"></div>
            <p className="text-sm text-gray-600">Processing Excel file...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">
                Excel files (.xlsx, .xls) up to 10MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {schemasCount > 0 && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700">
            Successfully loaded {schemasCount} schemes from Excel
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500">
        <p className="font-medium mb-1">Expected Excel columns:</p>
        <p>title, category, amount, eligibility, description, deadline, status, featured, applicants, successRate</p>
      </div>
    </div>
  );
};