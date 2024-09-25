"use client"
import { useState, useRef, useMemo, useCallback } from 'react';
import { Template, BLANK_PDF } from '@pdfme/common';
import { Designer, Form , Viewer} from '@pdfme/ui';
import { generate } from '@pdfme/generator';
import { useEffect } from 'react';


const defaultTemplate: Template = {
  basePdf: BLANK_PDF, 
  schemas: [
    {
      a: {
        type: 'text',
        position: { x: 0, y: 0 },
        width: 10,
        height: 10,
      },
      b: {
        type: 'text',
        position: { x: 10, y: 10 },
        width: 10,
        height: 10,
      },
      c: {
        type: 'text',
        position: { x: 20, y: 20 },
        width: 10,
        height: 10,
      },
    },
  ],
};


const PdfDesigner = () => {
  const designerRef = useRef<HTMLDivElement>(null); // Reference for the container div
  const [template, setTemplate] = useState<Template>(defaultTemplate);

  useEffect(() => {
    if (designerRef.current) {
      // Initialize the Designer when the component mounts
      const designer = new Designer({
        domContainer: designerRef.current,
        template,
      });

      designer.onChangeTemplate((updatedTemplate: Template) => {
        console.log('Updated Template:', updatedTemplate);
      });
    }
  }, [template]);

  return (
    <div style={{ height: '100vh' }}>
      {/* The div where the Designer will be mounted */}
      <div ref={designerRef} style={{ width: '100%', height: '100%' }}></div>
    </div>
  );
};


export default function Home() {
  

  const [pdfUrl, setPdfUrl] = useState<string | null>(null); // State to hold the PDF URL
  const inputs  = useMemo(() => [
    {
      a: 'John',
      b: 'Doe',
      c: 'https://randomuser.me/api/portraits/men/75.jpg', 
    },
  ], []);

  const handleGeneratePdf = useCallback(async () => {

    try {
      const pdfBuffer = await generate({ template: defaultTemplate, inputs });
      console.log(pdfBuffer);
      const blob = new Blob([pdfBuffer], { type: 'application/pdf' });

      const url = URL.createObjectURL(blob);
      console.log(url);
      setPdfUrl(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  }, [inputs]);

  useEffect(() => {
    handleGeneratePdf();
  }, [ handleGeneratePdf]);

const formEl = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (formEl.current) {
     new Form({ template: defaultTemplate, inputs, domContainer: formEl.current});

  }
}, [inputs]);

const viewEl = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (viewEl.current) {
     new Viewer({ template: defaultTemplate, inputs, domContainer: viewEl.current});

  }
}, [inputs]);


  return (
    <div className='flex flex-col gap-4'>
    <h1 className='text-2xl font-bold'>generated pdf</h1>
      {pdfUrl && (
        <iframe
          src={pdfUrl}
          title="Generated PDF"
          style={{ width: '100%', height: '500px', border: 'none' }}
        />
      )}
      <h1 className='text-2xl font-bold'>pdf designer</h1>
      <PdfDesigner />
      <h1 className='text-2xl font-bold'>form</h1>
      <div ref={formEl}/>
      <h1 className='text-2xl font-bold'>viewer</h1>
      <div ref={viewEl}/>
      </div>
  );
}
