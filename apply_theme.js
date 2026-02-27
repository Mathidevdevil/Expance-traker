const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function replaceColors(filePath) {
    if (!filePath.endsWith('.jsx') && !filePath.endsWith('.js')) return;
    let content = fs.readFileSync(filePath, 'utf8');

    // Backgrounds
    content = content.replace(/dark:bg-slate-900/g, 'dark:bg-transparent');
    content = content.replace(/dark:bg-slate-800/g, 'dark:bg-[#1F1B3A]');
    content = content.replace(/dark:bg-slate-700\/50/g, 'dark:bg-[#302B63]/50');
    content = content.replace(/dark:bg-slate-700/g, 'dark:bg-[#24243E]');

    // Borders
    content = content.replace(/dark:border-slate-700/g, 'dark:border-[#302B63]/50');
    content = content.replace(/dark:border-slate-600/g, 'dark:border-[#302B63]');

    // Purple Buttons
    content = content.replace(/bg-blue-600/g, 'bg-[#7C3AED]');
    content = content.replace(/dark:bg-blue-600/g, 'dark:bg-[#7C3AED]');
    content = content.replace(/hover:bg-blue-700/g, 'hover:bg-[#6D28D9]');
    content = content.replace(/dark:hover:bg-blue-700/g, 'dark:hover:bg-[#6D28D9]');

    // Purple Text
    content = content.replace(/text-blue-600/g, 'text-[#7C3AED]');
    content = content.replace(/dark:text-blue-400/g, 'dark:text-[#7C3AED]');

    // Focus Glow
    content = content.replace(/focus:ring-blue-500/g, 'focus:ring-[#3B82F6] dark:focus:shadow-[0_0_15px_rgba(59,130,246,0.5)]');

    // Expense (Red)
    content = content.replace(/text-red-500/g, 'text-[#F43F5E]');
    content = content.replace(/dark:text-red-400/g, 'dark:text-[#F43F5E]');
    content = content.replace(/bg-red-50/g, 'bg-[#F43F5E]/10');
    content = content.replace(/dark:bg-red-900\/20/g, 'dark:bg-[#F43F5E]/10');
    content = content.replace(/dark:bg-red-900\/30/g, 'dark:bg-[#F43F5E]/20');
    content = content.replace(/bg-red-100/g, 'bg-[#F43F5E]/20');
    content = content.replace(/border-red-100/g, 'border-[#F43F5E]/20');
    content = content.replace(/dark:border-red-900\/30/g, 'dark:border-[#F43F5E]/20');

    // Income (Green)
    content = content.replace(/text-green-500/g, 'text-[#10B981]');
    content = content.replace(/dark:text-green-400/g, 'dark:text-[#10B981]');
    content = content.replace(/bg-green-50/g, 'bg-[#10B981]/10');
    content = content.replace(/dark:bg-green-900\/20/g, 'dark:bg-[#10B981]/10');
    content = content.replace(/dark:bg-green-900\/30/g, 'dark:bg-[#10B981]/20');
    content = content.replace(/bg-green-100/g, 'bg-[#10B981]/20');
    content = content.replace(/border-green-100/g, 'border-[#10B981]/20');
    content = content.replace(/dark:border-green-900\/30/g, 'dark:border-[#10B981]/20');

    fs.writeFileSync(filePath, content, 'utf8');
}

walkDir(srcDir, replaceColors);
console.log('Colors replaced successfully!');
