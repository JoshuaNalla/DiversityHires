import React, { useCallback, useState } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useStore } from '../../store/useStore';

export default function ResumeDropzone() {
  const [isDragActive, setIsDragActive] = useState(false);
  const { setSummary, setIsAnalyzing, setError, isAnalyzing, error } = useStore();

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setIsDragActive(true);
    else setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = async (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file) => {
    if (file.type !== 'application/pdf') {
      setError("Please upload a PDF file.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('resume', file);

    try {
      const response = await axios.post('http://localhost:8000/api/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      if (response.data.error) {
        setError(response.data.error);
        return;
      }
      
      setSummary(response.data.summary);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to analyze resume.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-4">
      <div 
        className={`w-full p-12 mt-8 text-center rounded-2xl border-2 border-dashed transition-all duration-300 ${
          isDragActive 
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
            : 'border-slate-700 bg-slate-900/50 hover:bg-slate-800 hover:border-indigo-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center gap-4">
          {isAnalyzing ? (
            <div className="relative">
               <div className="absolute -inset-4 bg-indigo-500/20 blur-xl rounded-full"></div>
               <Loader2 className="w-16 h-16 text-indigo-400 animate-spin" />
            </div>
          ) : (
            <Upload className={`w-16 h-16 ${isDragActive ? 'text-indigo-400' : 'text-slate-400'}`} />
          )}

          <div className="space-y-2">
            <h3 className="text-xl font-medium text-slate-100">
              {isAnalyzing ? "Analyzing your background..." : "Upload your Resume"}
            </h3>
            <p className="text-slate-400">
              {isAnalyzing 
                ? "Our AI is extracting your skills and framing interview questions." 
                : "Drag & drop your PDF here, or click to select."}
            </p>
          </div>

          <label className={`relative mt-4 cursor-pointer overflow-hidden rounded-full font-medium ${isAnalyzing ? 'hidden' : 'inline-flex group'}`}>
             <input type="file" className="hidden" accept=".pdf" onChange={handleChange} />
             <span className="relative flex items-center justify-center gap-2 px-8 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-full group-hover:bg-indigo-500 transition-colors">
                 <FileText className="w-4 h-4" />
                 Browse Files
             </span>
          </label>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-4 text-red-200 bg-red-900/50 border border-red-500/30 rounded-xl w-full text-center">
          {error}
        </div>
      )}
    </div>
  );
}
