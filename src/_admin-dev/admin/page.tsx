"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), { ssr: false });

interface Doc {
  category: string;
  slug: string;
  title: string;
  path: string;
  filePath: string;
}

export default function AdminPage() {
  const [docs, setDocs] = useState<Doc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  // 新建文档状态
  const [showCreate, setShowCreate] = useState(false);
  const [newDoc, setNewDoc] = useState({ category: "guide", slug: "", title: "" });

  useEffect(() => {
    fetchDocs();
  }, []);

  async function fetchDocs() {
    setLoading(true);
    try {
      const res = await fetch("/api/docs");
      const data = await res.json();
      setDocs(data.docs || []);
    } catch {
      setMessage("加载文档列表失败");
    }
    setLoading(false);
  }

  async function loadDoc(doc: Doc) {
    setSelectedDoc(doc);
    setLoading(true);
    try {
      const res = await fetch(`/api/docs/${doc.category}/${doc.slug}`);
      const data = await res.json();
      setContent(data.raw || "");
    } catch {
      setMessage("加载文档失败");
    }
    setLoading(false);
  }

  async function saveDoc() {
    if (!selectedDoc) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/docs/${selectedDoc.category}/${selectedDoc.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      if (res.ok) {
        setMessage("保存成功 ✓");
        setTimeout(() => setMessage(""), 2000);
      } else {
        setMessage("保存失败");
      }
    } catch {
      setMessage("保存失败");
    }
    setSaving(false);
  }

  async function createDoc() {
    if (!newDoc.slug || !newDoc.title) {
      setMessage("请填写完整信息");
      return;
    }
    try {
      const res = await fetch("/api/docs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newDoc),
      });
      if (res.ok) {
        setMessage("创建成功 ✓");
        setShowCreate(false);
        setNewDoc({ category: "guide", slug: "", title: "" });
        fetchDocs();
      } else {
        const data = await res.json();
        setMessage(data.error || "创建失败");
      }
    } catch {
      setMessage("创建失败");
    }
  }

  // 按分类分组
  const groupedDocs = docs.reduce((acc, doc) => {
    if (!acc[doc.category]) acc[doc.category] = [];
    acc[doc.category].push(doc);
    return acc;
  }, {} as Record<string, Doc[]>);

  const categoryNames: Record<string, string> = {
    guide: "📖 快速开始",
    features: "🎯 功能介绍",
    faq: "❓ 常见问题",
    changelog: "📝 更新日志",
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex">
      {/* 左侧文档列表 */}
      <div className="w-72 border-r border-gray-800 p-4 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-bold">文档管理</h1>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="px-2 py-1 bg-blue-600 rounded text-sm hover:bg-blue-700"
          >
            + 新建
          </button>
        </div>

        {showCreate && (
          <div className="mb-4 p-3 bg-gray-900 rounded border border-gray-700">
            <select
              value={newDoc.category}
              onChange={(e) => setNewDoc({ ...newDoc, category: e.target.value })}
              className="w-full mb-2 p-2 bg-gray-800 rounded text-sm"
            >
              <option value="guide">快速开始</option>
              <option value="features">功能介绍</option>
              <option value="faq">常见问题</option>
              <option value="changelog">更新日志</option>
            </select>
            <input
              placeholder="slug (英文)"
              value={newDoc.slug}
              onChange={(e) => setNewDoc({ ...newDoc, slug: e.target.value })}
              className="w-full mb-2 p-2 bg-gray-800 rounded text-sm"
            />
            <input
              placeholder="标题"
              value={newDoc.title}
              onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
              className="w-full mb-2 p-2 bg-gray-800 rounded text-sm"
            />
            <button
              onClick={createDoc}
              className="w-full py-2 bg-green-600 rounded text-sm hover:bg-green-700"
            >
              创建
            </button>
          </div>
        )}

        {loading && !selectedDoc && <p className="text-gray-500">加载中...</p>}

        {Object.entries(groupedDocs).map(([category, categoryDocs]) => (
          <div key={category} className="mb-4">
            <h2 className="text-sm text-gray-400 mb-2">
              {categoryNames[category] || category}
            </h2>
            {categoryDocs.map((doc) => (
              <button
                key={doc.path}
                onClick={() => loadDoc(doc)}
                className={`w-full text-left px-3 py-2 rounded text-sm mb-1 ${
                  selectedDoc?.path === doc.path
                    ? "bg-blue-600"
                    : "hover:bg-gray-800"
                }`}
              >
                {doc.title}
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* 右侧编辑区 */}
      <div className="flex-1 flex flex-col">
        {/* 工具栏 */}
        <div className="h-14 border-b border-gray-800 px-4 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            {selectedDoc ? (
              <span>
                编辑: <span className="text-white">{selectedDoc.title}</span>
                <span className="ml-2 text-gray-600">{selectedDoc.filePath}</span>
              </span>
            ) : (
              "选择一个文档开始编辑"
            )}
          </div>
          <div className="flex items-center gap-3">
            {message && (
              <span className={message.includes("成功") ? "text-green-400" : "text-red-400"}>
                {message}
              </span>
            )}
            {selectedDoc && (
              <button
                onClick={saveDoc}
                disabled={saving}
                className="px-4 py-2 bg-blue-600 rounded text-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {saving ? "保存中..." : "保存"}
              </button>
            )}
          </div>
        </div>

        {/* 编辑器 */}
        <div className="flex-1">
          {selectedDoc ? (
            <MonacoEditor
              height="100%"
              language="markdown"
              theme="vs-dark"
              value={content}
              onChange={(value) => setContent(value || "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: "on",
                lineNumbers: "on",
                scrollBeyondLastLine: false,
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <p className="text-4xl mb-4">📝</p>
                <p>从左侧选择文档开始编辑</p>
                <p className="text-sm mt-2">或点击「新建」创建新文档</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
