import React from "react";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <style>
        {`
          :root {
            --primary-gradient: linear-gradient(135deg, #1e40af 0%, #0ea5e9 100%);
            --surface-glass: rgba(255, 255, 255, 0.85);
            --shadow-soft: 0 8px 32px rgba(0, 0, 0, 0.12);
            --shadow-elevated: 0 20px 60px rgba(0, 0, 0, 0.15);
            --border-subtle: rgba(255, 255, 255, 0.2);
          }
          
          .glass-effect {
            background: var(--surface-glass);
            backdrop-filter: blur(16px);
            border: 1px solid var(--border-subtle);
          }
          
          .message-bubble {
            background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
            box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          }
          
          .online-indicator {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2);
          }
          
          @keyframes messageSlide {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .message-enter {
            animation: messageSlide 0.3s ease-out;
          }
          
          .gradient-text {
            background: var(--primary-gradient);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        `}
      </style>
      {children}
    </div>
  );
}