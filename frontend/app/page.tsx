'use client';

import { useEffect, useState } from 'react';

export default function Home() {
    const [guestbooks, setGuestbooks] = useState<any[]>([]);
    const [nickname, setNickname] = useState('');
    const [content, setContent] = useState('');

    const fetchGuestbooks = async () => {
        const res = await fetch('http://13.125.18.200:8080/api/guestbooks',{method: 'GET'});
        const data = await res.json();
        setGuestbooks(data);
    };

    const submitGuestbook = async () => {
        if (!nickname || !content) return;

        await fetch('http://13.125.18.200:8080/api/guestbooks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, content }),
        });

        setNickname('');
        setContent('');
        fetchGuestbooks();
    };

    useEffect(() => {
        fetchGuestbooks();
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 px-8 py-10">
            {/* 제목 */}
            <h2 className="text-3xl font-bold mb-10">나의 개발 다짐</h2>

            {/* 입력 폼 */}
            <div className="max-w-xl space-y-4 mb-12">
                <input
                    className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="닉네임"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                />

                <textarea
                    className="w-full border border-gray-300 rounded-md px-4 py-3 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="다짐 내용"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />

                <button
                    className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-900 transition"
                    onClick={submitGuestbook}
                >
                    등록
                </button>
            </div>

            {/* 목록 */}
            <div className="max-w-xl space-y-6">
                {guestbooks.map((g) => (
                    <div
                        key={g.id}
                        className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm"
                    >
                        <div className="font-semibold text-lg mb-1">{g.nickname}</div>
                        <div className="text-gray-800 mb-3">{g.content}</div>
                        <div className="text-sm text-gray-400">
                            {new Date(g.createdAt).toLocaleString()}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
