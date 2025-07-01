import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Scheme } from '../types';

export const useExcelData = () => {
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadExcelData = async (file: File) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      const processedSchemes: Scheme[] = jsonData.map((row: any, index) => ({
        id: row.id || `scheme-${index + 1}`,
        title: row.title || row.Title || row.TITLE || '',
        category: row.category || row.Category || row.CATEGORY || 'General',
        amount: row.amount || row.Amount || row.AMOUNT || '₹0',
        eligibility: typeof row.eligibility === 'string' 
          ? row.eligibility.split(',').map((e: string) => e.trim())
          : row.eligibility || [],
        description: row.description || row.Description || row.DESCRIPTION || '',
        deadline: row.deadline || row.Deadline || row.DEADLINE || '2024-12-31',
        status: (row.status || row.Status || row.STATUS || 'active') as 'active' | 'upcoming' | 'closed',
        featured: Boolean(row.featured || row.Featured || row.FEATURED),
        applicants: Number(row.applicants || row.Applicants || row.APPLICANTS) || 0,
        successRate: Number(row.successRate || row.SuccessRate || row.SUCCESS_RATE) || 0,
        targetAudience: row.targetAudience || row.TargetAudience || row.TARGET_AUDIENCE || '',
        documents: typeof row.documents === 'string'
          ? row.documents.split(',').map((d: string) => d.trim())
          : row.documents || [],
        processingTime: row.processingTime || row.ProcessingTime || row.PROCESSING_TIME || '30 days',
        contactInfo: row.contactInfo || row.ContactInfo || row.CONTACT_INFO || ''
      }));
      
      setSchemes(processedSchemes);
    } catch (err) {
      setError('Failed to process Excel file. Please check the format.');
      console.error('Excel processing error:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateScheme = (updatedScheme: Scheme) => {
    setSchemes(prev => prev.map(scheme => 
      scheme.id === updatedScheme.id ? updatedScheme : scheme
    ));
  };

  const addScheme = (newScheme: Scheme) => {
    setSchemes(prev => [...prev, newScheme]);
  };

  const deleteScheme = (schemeId: string) => {
    setSchemes(prev => prev.filter(scheme => scheme.id !== schemeId));
  };

  return {
    schemes,
    loading,
    error,
    loadExcelData,
    updateScheme,
    addScheme,
    deleteScheme
  };
};