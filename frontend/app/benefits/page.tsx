'use client';

import { useState } from 'react';
import {
  Upload, FileText, CheckCircle2, Trash2, Brain, RefreshCw, Database
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
}

const INITIAL_FILES: UploadedFile[] = [
  { id: '1', name: 'MCD_Garbage_Collection_Rules_2024.pdf', size: '2.4 MB', uploadedAt: '2026-01-05', status: 'completed' },
  { id: '2', name: 'Water_Supply_Guidelines_Delhi.pdf', size: '1.8 MB', uploadedAt: '2026-01-03', status: 'completed' },
];

export default function BenefitsPage() {
  const [files, setFiles] = useState<UploadedFile[]>(INITIAL_FILES);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({ title: 'Invalid File', description: 'Only PDF documents are allowed.', variant: 'destructive' });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setIsUploading(true);
    setTimeout(() => {
        setFiles(prev => [{
            id: Date.now().toString(),
            name: selectedFile.name,
            size: `${(selectedFile.size / (1024*1024)).toFixed(2)} MB`,
            uploadedAt: new Date().toISOString().split('T')[0],
            status: 'completed'
        }, ...prev]);
        setIsUploading(false);
        setSelectedFile(null);
        toast({ title: 'Success', description: 'Document indexed into Knowledge Base.' });
    }, 2000);
  };

  const handleDelete = (id: string) => {
      setFiles(prev => prev.filter(f => f.id !== id));
      toast({ title: 'Deleted', description: 'File removed from registry.' });
  };

  return (
    <div className="flex flex-col space-y-6 max-w-[1600px] mx-auto p-2 min-h-[calc(100vh-2rem)]">
      
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <Database className="w-6 h-6 text-blue-600" />
          Benefits & Knowledge Registry
        </h1>
        <p className="text-sm text-slate-500 mt-1">Upload official documents to train the AI Assistant</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in slide-in-from-right-4 duration-500">
            {/* Left Column: Stats */}
            <div className="space-y-6">
                <Card className="bg-slate-900 text-white border-slate-800">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Brain className="w-5 h-5 text-purple-400" /> Neural Index Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-slate-400 text-sm">Vector Chunks</span>
                            <span className="font-mono font-bold text-purple-400">15,420</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 w-[98%]"></div>
                        </div>
                        <p className="text-xs text-slate-500">System is ready to answer queries based on indexed PDFs.</p>
                    </CardContent>
                </Card>
            </div>

            {/* Middle & Right: Upload Zone */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-blue-600" /> Document Ingestion
                    </CardTitle>
                    <CardDescription>Add new knowledge to the AI Agent</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Upload Box */}
                    <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                        selectedFile ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}>
                        <input type="file" accept=".pdf" onChange={handleFileSelect} className="hidden" id="pdf-upload" />
                        <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center">
                            {selectedFile ? (
                                <>
                                    <FileText className="w-12 h-12 text-blue-600 mb-2 animate-bounce" />
                                    <p className="font-bold text-slate-800">{selectedFile.name}</p>
                                    <Button onClick={(e) => { e.preventDefault(); handleUpload(); }} disabled={isUploading} className="bg-blue-600 mt-4">
                                        {isUploading ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
                                        {isUploading ? 'Processing...' : 'Confirm Upload'}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                                        <Upload className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <p className="font-medium text-slate-900">Click to upload PDF</p>
                                    <p className="text-xs text-slate-500 mt-1">or drag and drop here</p>
                                </>
                            )}
                        </label>
                    </div>

                    {/* File List */}
                    <div className="space-y-3">
                        <h4 className="text-sm font-bold text-slate-900">Indexed Files</h4>
                        {files.map((file) => (
                            <div key={file.id} className="flex items-center p-3 bg-slate-50 rounded-lg border border-slate-100 group">
                                <div className="p-2 bg-white rounded shadow-sm mr-3">
                                    <FileText className="w-4 h-4 text-red-500" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-slate-800 truncate">{file.name}</p>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <span>{file.size}</span>
                                        <span>•</span>
                                        <span>{file.uploadedAt}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {file.status === 'processing' ? (
                                        <span className="flex items-center gap-1 text-xs text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full">
                                            <RefreshCw className="w-3 h-3 animate-spin" /> Processing
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
                                            <CheckCircle2 className="w-3 h-3" /> Indexed
                                        </span>
                                    )}
                                    <button onClick={() => handleDelete(file.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}