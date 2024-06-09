import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FaPaperPlane, FaRedo } from 'react-icons/fa'; // Importing icons
import domtoimage from 'dom-to-image-more'; // Importing dom-to-image-more library

const Chatbot = () => {
  const [htmlOutput, setHtmlOutput] = useState('');
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [format, setFormat] = useState('png'); // State for the selected format
  const outputRef = useRef(null); // Ref to the HTML output container

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() === '') return;

    setLoading(true);

    if (!sessionId) {
      // Start a new session with the user's first message
      try {
        const response = await axios.post('http://localhost:3100/start-session', { message: input });
        setSessionId(response.data.sessionId);
        setHtmlOutput(response.data.data);
      } catch (error) {
        console.error('Error starting session:', error);
      } finally {
        setLoading(false);
      }
    } else {
      // Continue the existing session
      try {
        const response = await axios.post('http://localhost:3100/continue-session', {
          sessionId,
          message: input,
        });
        setHtmlOutput(response.data.data);
      } catch (error) {
        console.error('Error in chatbot response:', error);
      } finally {
        setLoading(false);
      }
    }

    setInput('');
  };

  const handleReset = async () => {
    try {
      if (sessionId) {
        await axios.post('http://localhost:3100/reset-session', { sessionId });
        setHtmlOutput('');
        setSessionId(null);
      }
    } catch (error) {
      console.error('Error resetting session:', error);
    }
  };

  const handleExport = async () => {
    if (!outputRef.current) return;

    let dataUrl;
    try {
      const node = outputRef.current.cloneNode(true);
      node.style.width = 'auto';
      node.style.height = 'auto';
      document.body.appendChild(node); // Temporarily add the node to the DOM to calculate dimensions

      if (format === 'png') {
        dataUrl = await domtoimage.toPng(node);
      } else if (format === 'jpeg') {
        dataUrl = await domtoimage.toJpeg(node, { quality: 0.95 });
      } else if (format === 'svg') {
        dataUrl = await domtoimage.toSvg(node);
      }

      document.body.removeChild(node); // Remove the node from the DOM after calculation

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `wireframe-ai.${format}`;
      link.click();
    } catch (error) {
      console.error('Error exporting image:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          {htmlOutput && (
            <div style={{ position: 'absolute', right: 20, padding: '20px' }}>
              <select value={format} onChange={(e) => setFormat(e.target.value)} style={{ padding: '5px 10px', marginRight: '10px' }}>
                <option value="png">PNG</option>
                <option value="jpeg">JPG</option>
                <option value="svg">SVG</option>
              </select>
              <button onClick={handleExport} style={{ padding: '10px 20px', borderRadius: '5px', border: 'none', backgroundColor: '#28a745', color: '#fff' }}>
                Export
              </button>
            </div>
          )}
      </div>
      <div ref={outputRef} style={{ flex: 1, border: '1px solid #ccc', overflowY: 'auto', padding: '20px', position: 'relative', height: 'calc(100vh - 200px)', maxHeight: '65vh'}}>
        {loading ? (
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="spinner"></div>
          </div>
        ) : (
          <div dangerouslySetInnerHTML={{ __html: htmlOutput }} />
        )}
      </div>
      <form onSubmit={handleSubmit} style={{ display: 'flex', padding: '10px', borderTop: '1px solid #ccc', background: '#f8f9fa', alignItems: 'center' }}>
        <div style={{ display: 'flex', flex: 1, alignItems: 'center', background: '#fff', borderRadius: '5px', border: '1px solid #ccc' }}>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{ flex: 1, padding: '10px', border: 'none', borderRadius: '5px 0 0 5px', resize: 'none', width: '600px' }}
            placeholder="Enter your requirement..."
            rows="2"
          />
          <button type="submit" disabled={loading} style={{ padding: '10px 15px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '0 5px 5px 0' }}>
            <FaPaperPlane size={20} color={loading ? '#ccc' : '#007bff'} />
          </button>
          <button type="button" onClick={handleReset} disabled={loading} style={{ padding: '10px 15px', border: 'none', background: 'none', cursor: 'pointer', marginLeft: '5px' }}>
            <FaRedo size={20} color={loading ? '#ccc' : '#dc3545'} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chatbot;
