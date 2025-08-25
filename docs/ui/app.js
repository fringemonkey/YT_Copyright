(() => {
  const e = React.createElement;

  const DOC_LINKS = [
    { id:'counsel', label:'Counsel Brief', path:'../counsel-brief.html' },
    { id:'evidence', label:'Evidence Kit', path:'../evidence-kit.html' },
    { id:'dashboard', label:'Dashboard Spec', path:'../dashboard-spec.html' },
    { id:'yt-letter', label:'Outreach: YouTube', path:'../outreach/youtube-open-letter.html' },
    { id:'label-letter', label:'Outreach: Labels/Agents', path:'../outreach/label-open-letter.html' },
    { id:'citations', label:'Appendix: Citations', path:'../appendices/citations.html' },
    { id:'glossary', label:'Appendix: Glossary', path:'../appendices/glossary.html' },
    { id:'legal', label:'Appendix: Legal Notes', path:'../appendices/legal-notes.html' },
  ];

  function Header({dark, onToggle}) {
    return e('div', {className:'header'},
      e('div', {className:'brand'}, 'Content ID Defense Kit — UI'),
      e('button', {className:'toggle', onClick:onToggle}, dark ? 'Light mode' : 'Dark mode')
    );
  }

  function Sidebar({active, onSelect}) {
    return e('div', {className:'sidebar'},
      e('div', {className:'section'},
        e('h4', null, 'Docs'),
        e('div', {className:'nav'},
          DOC_LINKS.map(l => e('a', {
            key:l.id, href:'#', onClick:(ev)=>{ev.preventDefault(); onSelect(l)},
            className: active?.id === l.id ? 'active' : ''
          }, l.label))
        )
      ),
      e('div', {className:'section'},
        e('h4', null, 'Data'),
        e('div', {className:'small'}, 'Explore synthetic demo data: /synthetic-data/demo_claims.csv')
      )
    );
  }

  function DocsPane({doc}) {
    return e('div', {className:'card'},
      e('div', {className:'small', style:{marginBottom:8}}, 'Read-only embed of the rendered Markdown page.'),
      e('div', {className:'iframe-wrap'},
        e('iframe', {src: doc?.path || '../index.html', title:'Docs'})
      )
    );
  }

  function DataPane() {
    const [stats, setStats] = React.useState(null);
    const [rows, setRows] = React.useState([]);
    const chartRef = React.useRef(null);
    const canvasRef = React.useRef(null);

    React.useEffect(() => {
      // Load CSV
      Papa.parse('../../synthetic-data/demo_claims.csv', {
        download: true,
        header: true,
        complete: (res) => {
          const data = res.data.filter(r => r.timestamp);
          setRows(data.slice(0, 200));
          const perMin = {};
          const dupTemplates = {};
          const shortDur = {count:0,total:data.length};
          const headerSig = {};

          data.forEach(r => {
            // per minute count
            const d = new Date(r.timestamp);
            const key = d.getUTCFullYear()+'-'+String(d.getUTCMonth()+1).padStart(2,'0')+'-'+String(d.getUTCDate()).padStart(2,'0')
              +' '+String(d.getUTCHours()).padStart(2,'0')+':'+String(d.getUTCMinutes()).padStart(2,'0');
            perMin[key] = (perMin[key]||0)+1;

            // duplicate body templates (very naive: whole string)
            const body = (r.body_text||'').trim();
            dupTemplates[body] = (dupTemplates[body]||0)+1;

            // short durations
            const dur = parseFloat(r.match_duration||'0');
            if (!isNaN(dur) && dur < 10) shortDur.count++;

            // header signature
            const sig = (r.raw_headers||'').split(';')[0].trim();
            headerSig[sig] = (headerSig[sig]||0)+1;
          });

          // Build chart dataset
          const labels = Object.keys(perMin).sort();
          const values = labels.map(k => perMin[k]);

          setStats({
            total:data.length,
            minutes: labels.length,
            bursts: Math.max(...values),
            shortShare: data.length ? Math.round(shortDur.count*100/data.length) : 0,
            topTemplate: Object.entries(dupTemplates).sort((a,b)=>b[1]-a[1])[0],
            topHeader: Object.entries(headerSig).sort((a,b)=>b[1]-a[1])[0],
            labels, values
          });
        }
      });
    }, []);

    React.useEffect(() => {
      if (!stats || !canvasRef.current) return;
      if (chartRef.current) { chartRef.current.destroy(); }
      const ctx = canvasRef.current.getContext('2d');
      chartRef.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: stats.labels,
          datasets: [{
            label: 'Claims per minute (synthetic)',
            data: stats.values
          }]
        },
        options: {
          responsive: true,
          scales: { x: { ticks: { maxRotation:0, autoSkip:true }}, y: { beginAtZero:true } }
        }
      });
    }, [stats]);

    return e('div', null,
      e('div', {className:'card'},
        e('div', {className:'kv'},
          e('div', {className:'item'}, e('div', {className:'small'}, 'Total claims'), e('div', null, stats?.total || '—')),
          e('div', {className:'item'}, e('div', {className:'small'}, 'Max in a minute (burst)'), e('div', null, stats?.bursts || '—')),
          e('div', {className:'item'}, e('div', {className:'small'}, 'Minutes observed'), e('div', null, stats?.minutes || '—')),
          e('div', {className:'item'}, e('div', {className:'small'}, 'Short matches <10s'), e('div', null, (stats?.shortShare ?? '—') + '%'))
        )
      ),
      e('div', {className:'card'},
        e('canvas', {ref: canvasRef, height: 180})
      ),
      e('div', {className:'card'},
        e('div', {className:'small', style:{marginBottom:8}}, 'First 50 rows (synthetic demo_claims.csv)'),
        e('table', {className:'table'},
          e('thead', null, e('tr', null,
            ['timestamp','claim_id','claimant','policy','match_duration','video_id/url'].map(h => e('th',{key:h},h))
          )),
          e('tbody', null,
            (rows.slice(0,50)).map((r,i) => e('tr', {key:i},
              e('td', null, r.timestamp || ''),
              e('td', null, r.claim_id || ''),
              e('td', null, r.claimant || ''),
              e('td', null, r.policy || ''),
              e('td', null, r.match_duration || ''),
              e('td', null, r['video_id/url'] || '')
            ))
          )
        )
      )
    );
  }

  function App(){
    const [dark, setDark] = React.useState(true);
    const [tab, setTab] = React.useState('docs');
    const [doc, setDoc] = React.useState(DOC_LINKS[0]);

    React.useEffect(()=>{
      document.body.style.background = dark ? 'var(--bg)' : '#f7f7fb';
      document.body.style.color = dark ? 'var(--text)' : '#111827';
    },[dark]);

    return e(React.Fragment, null,
      e(Header, {dark, onToggle: () => setDark(!dark)}),
      e('div', {className:'app'},
        e(Sidebar, {active:doc, onSelect:setDoc}),
        e('div', {className:'main'},
          e('div', {className:'tabs'},
            e('button', {className:'tab ' + (tab==='docs'?'active':''), onClick:()=>setTab('docs')}, 'Docs'),
            e('button', {className:'tab ' + (tab==='data'?'active':''), onClick:()=>setTab('data')}, 'Data Explorer')
          ),
          tab==='docs' ? e(DocsPane, {doc}) : e(DataPane, null)
        )
      ),
      e('footer', null, 'Read-only UI. No outbound actions.')
    );
  }

  ReactDOM.createRoot(document.getElementById('root')).render(e(App));
})();
