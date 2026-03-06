/**
 * PRINCE KUMAR - PORTFOLIO BACKEND SERVER
 * Node.js REST API - Zero external dependencies
 * Windows PowerShell SAFE - no emoji in console output
 */

const http = require('http');
const fs   = require('fs');
const path = require('path');

const PORT = process.env.PORT || 5000;

// Fix Windows console encoding
if (process.platform === 'win32') {
  try { process.stdout.setEncoding('utf8'); process.stderr.setEncoding('utf8'); } catch(e) {}
}

// ─── IN-MEMORY STORE ──────────────────────────────────────────────────────────
let visitorCount = 0;
const messages   = [];

// ─── CORS (allows Live Server port 5500 + all origins) ───────────────────────
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// ─── PORTFOLIO DATA ───────────────────────────────────────────────────────────
const DATA = {
  profile: {
    name: "Prince Kumar", title: "Full Stack Developer",
    email: "rajprincekumar99550@gmail.com", phone: "+91 7870496423",
    location: "Vadodara, Gujarat, India",
    linkedin: "https://www.linkedin.com/in/prince-yadav-a8886a312/",
    github: "https://github.com/Prinxeyadav",
    university: "Parul University", degree: "B.Tech Information Technology",
    year: "2nd Year (2023-2027)", available: true
  },
  projects: [
    { id:1, title:"Personal Portfolio Website", category:"Frontend",
      description:"Responsive portfolio with HTML5 and CSS3 animations, mobile-first design, deployed on GitHub Pages.",
      stack:["HTML5","CSS3","JavaScript","GitHub Pages"], icon:"globe",
      github:"https://github.com/Prinxeyadav", live:"https://github.com/Prinxeyadav" },
    { id:2, title:"Analytics Dashboard", category:"Data Analytics",
      description:"Multi-page Power BI dashboard with KPI cards, dynamic filters, and Python data cleaning pipeline.",
      stack:["Power BI","Python","Pandas","Data Visualization"], icon:"chart",
      github:"https://github.com/Prinxeyadav", live:"https://github.com/Prinxeyadav" },
    { id:3, title:"REST API - Student System", category:"Backend",
      description:"RESTful API with full CRUD, authentication, JSON responses and modular MVC architecture.",
      stack:["Java","Python","REST API","Backend","CRUD"], icon:"gear",
      github:"https://github.com/Prinxeyadav", live:"https://github.com/Prinxeyadav" },
    { id:4, title:"ODDO Hackathon 2.0 Project", category:"Full Stack",
      description:"Full-stack prototype built at ODDO Hackathon 2.0 (National Level 2025). End-to-end solution under competitive pressure.",
      stack:["Java","Python","HTML5","CSS3","Backend"], icon:"trophy",
      github:"https://github.com/Prinxeyadav", live:"https://github.com/Prinxeyadav" }
  ],
  skills: [
    { id:1, category:"Programming Languages", icon:"code",   items:["Java","Python","C","HTML5","CSS3"], color:"red" },
    { id:2, category:"Frontend Development",  icon:"web",    items:["Responsive Design","CSS Animations","UI/UX","Mobile-First"], color:"blue" },
    { id:3, category:"Backend Development",   icon:"server", items:["REST APIs","Server Logic","CRUD","MVC Architecture","Auth"], color:"gold" },
    { id:4, category:"Data and Analytics",    icon:"chart",  items:["Power BI","Data Visualization","Dashboards","Pandas","Data Cleaning"], color:"gold" },
    { id:5, category:"Design and Creative",   icon:"design", items:["Adobe Photoshop","UI Mockups","Visual Design","Prototyping"], color:"blue" },
    { id:6, category:"Developer Tools",       icon:"tools",  items:["Git and GitHub","VS Code","CLI","Agile","Version Control"], color:"red" }
  ],
  hackathons: [
    { id:1, name:"ODDO Hackathon 2.0", organizer:"ODDO - National Level",
      year:2025, duration:"Competitive", location:"India", status:"competed",
      description:"Competed in ODDO Hackathon 2.0 - a national-level hackathon. Built full-stack prototype under strict time limits using Java, Python and web technologies.",
      highlights:["Backend Dev","Rapid Prototyping","Team Collaboration","National Level","Full Stack"] },
    { id:2, name:"DotSlash Hackathon", organizer:"NIT Surat - National Institute of Technology",
      year:2025, duration:"30+ Hours Offline", location:"Surat, Gujarat", status:"upcoming",
      description:"Preparing for DotSlash at NIT Surat. Planning full-stack solution with backend APIs, frontend UI, and Power BI analytics.",
      highlights:["Full Stack","30+ Hours","NIT Surat","Offline","Power BI","APIs"] }
  ]
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function sendJSON(res, code, data) {
  res.writeHead(code, { 'Content-Type': 'application/json', ...CORS });
  res.end(JSON.stringify(data, null, 2));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', c => body += c.toString());
    req.on('end',  () => { try { resolve(body ? JSON.parse(body) : {}); } catch(e) { reject(e); } });
  });
}

function serveFile(res, filePath) {
  const mime = { '.html':'text/html', '.css':'text/css', '.js':'application/javascript', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.ico':'image/x-icon', '.svg':'image/svg+xml' };
  const ext  = path.extname(filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('404 Not Found'); return; }
    res.writeHead(200, { 'Content-Type': mime[ext] || 'text/plain', ...CORS });
    res.end(data);
  });
}

function log(method, url, code) {
  const t = new Date().toISOString().replace('T',' ').slice(0,19);
  console.log('[' + t + '] ' + method.padEnd(5) + ' ' + url.padEnd(28) + ' ' + code);
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────
async function handleRequest(req, res) {
  const url    = req.url.split('?')[0];
  const method = req.method.toUpperCase();

  // CORS preflight - CRITICAL for Live Server on port 5500
  if (method === 'OPTIONS') { res.writeHead(204, CORS); res.end(); return; }

  if (url.startsWith('/api/')) {

    if (url === '/api/health'     && method === 'GET') { log(method,url,200); return sendJSON(res, 200, { status:'ONLINE', port:PORT, time: new Date().toISOString(), uptime: Math.floor(process.uptime())+'s' }); }
    if (url === '/api/profile'    && method === 'GET') { log(method,url,200); return sendJSON(res, 200, { success:true, data: DATA.profile }); }
    if (url === '/api/skills'     && method === 'GET') { log(method,url,200); return sendJSON(res, 200, { success:true, count: DATA.skills.length, data: DATA.skills }); }
    if (url === '/api/hackathons' && method === 'GET') { log(method,url,200); return sendJSON(res, 200, { success:true, count: DATA.hackathons.length, data: DATA.hackathons }); }
    if (url === '/api/messages'   && method === 'GET') { log(method,url,200); return sendJSON(res, 200, { success:true, count: messages.length, data: messages }); }

    if (url === '/api/projects' && method === 'GET') {
      visitorCount++;
      log(method,url,200);
      return sendJSON(res, 200, { success:true, count: DATA.projects.length, data: DATA.projects });
    }

    if (url === '/api/stats' && method === 'GET') {
      log(method,url,200);
      return sendJSON(res, 200, { success:true, data: {
        visitors: visitorCount,
        projects: DATA.projects.length,
        skills:   DATA.skills.reduce((a,s) => a + s.items.length, 0),
        hackathons: DATA.hackathons.length,
        messages: messages.length,
        uptime:   Math.floor(process.uptime())+'s'
      }});
    }

    if (url === '/api/contact' && method === 'POST') {
      try {
        const b = await parseBody(req);
        const name = (b.name||'').trim(), email = (b.email||'').trim(), message = (b.message||'').trim(), subject = (b.subject||'No Subject').trim();
        if (!name || !email || !message) { log(method,url,400); return sendJSON(res,400,{success:false,error:'Name, email and message required.'}); }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { log(method,url,400); return sendJSON(res,400,{success:false,error:'Invalid email.'}); }
        const entry = { id: messages.length+1, name, email, subject, message, timestamp: new Date().toISOString() };
        messages.push(entry);
        console.log('\n--- NEW MESSAGE from ' + name + ' <' + email + '> ---');
        console.log('Subject: ' + subject);
        console.log('Message: ' + message.substring(0,80) + '\n');
        log(method,url,201);
        return sendJSON(res, 201, { success:true, message:'Message received! Prince will reply soon.', id: entry.id });
      } catch(err) { log(method,url,500); return sendJSON(res,500,{success:false,error:err.message}); }
    }

    log(method,url,404);
    return sendJSON(res, 404, { success:false, error:'Route not found: '+url });
  }

  // Serve static frontend files
  visitorCount++;
  const frontendDir = path.join(__dirname, '..', 'frontend', 'public');
  let   filePath    = path.join(frontendDir, url === '/' ? 'index.html' : url);
  if (filePath.indexOf(frontendDir) !== 0) { res.writeHead(403); res.end('Forbidden'); return; }
  if (!path.extname(filePath)) filePath += '.html';
  log(method, url, 200);
  if (fs.existsSync(filePath)) serveFile(res, filePath);
  else serveFile(res, path.join(frontendDir, 'index.html'));
}

// ─── START ────────────────────────────────────────────────────────────────────
const server = http.createServer(handleRequest);

server.on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.error('\nERROR: Port ' + PORT + ' is already in use!');
    console.error('Solution: run this command first:  npx kill-port ' + PORT);
    console.error('Then run: node backend/server.js\n');
  } else {
    console.error('Server error: ' + err.message);
  }
  process.exit(1);
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('');
  console.log('================================================');
  console.log('  PRINCE KUMAR - PORTFOLIO SERVER STARTED');
  console.log('================================================');
  console.log('  Server   : http://localhost:' + PORT);
  console.log('  API base : http://localhost:' + PORT + '/api');
  console.log('  Status   : RUNNING - keep this terminal open!');
  console.log('================================================');
  console.log('  Test these in your browser:');
  console.log('  http://localhost:' + PORT + '/api/health');
  console.log('  http://localhost:' + PORT + '/api/projects');
  console.log('  http://localhost:' + PORT + '/api/skills');
  console.log('  http://localhost:' + PORT + '/api/hackathons');
  console.log('  http://localhost:' + PORT + '/api/stats');
  console.log('================================================');
  console.log('  Waiting for requests...');
  console.log('');
});