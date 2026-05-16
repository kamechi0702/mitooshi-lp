// mitooshi screens — S1〜S8 + modals (per DESIGN_SPEC v3.0)
// Loaded after icons.jsx

const { useState, useEffect, useRef, useMemo, useCallback } = React;

// ───────── shared atoms ─────────
function StatusBar({ dark }) {
  return (
    <div className="status-bar">
      <div className="status-time">9:41</div>
      <div className="status-icons">
        <svg width="18" height="11" viewBox="0 0 18 11"><rect x="0" y="6" width="3" height="5" rx="0.6" fill={dark?'#fff':'#000'}/><rect x="4.5" y="4" width="3" height="7" rx="0.6" fill={dark?'#fff':'#000'}/><rect x="9" y="2" width="3" height="9" rx="0.6" fill={dark?'#fff':'#000'}/><rect x="13.5" y="0" width="3" height="11" rx="0.6" fill={dark?'#fff':'#000'}/></svg>
        <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 3a8 8 0 016 2.5l-1 1a6.5 6.5 0 00-10 0l-1-1A8 8 0 018 3z" fill={dark?'#fff':'#000'}/><path d="M8 6a4.5 4.5 0 013.3 1.4l-1 1a3 3 0 00-4.6 0l-1-1A4.5 4.5 0 018 6z" fill={dark?'#fff':'#000'}/><circle cx="8" cy="9.5" r="1.3" fill={dark?'#fff':'#000'}/></svg>
        <svg width="26" height="12" viewBox="0 0 26 12"><rect x="0.5" y="0.5" width="22" height="11" rx="3" fill="none" stroke={dark?'#fff':'#000'} strokeOpacity="0.4"/><rect x="2" y="2" width="19" height="8" rx="1.6" fill={dark?'#fff':'#000'}/><path d="M24 4v4c.7-.2 1.2-.9 1.2-2s-.5-1.8-1.2-2z" fill={dark?'#fff':'#000'}/></svg>
      </div>
    </div>
  );
}

function BackBtn({ onClick, label = 'もどる' }) {
  return (
    <button className="back-button" onClick={onClick} aria-label="戻る">
      <Icon name="chevron-left" size={20} stroke="var(--primary)" strokeWidth={2.2}/>
      <span>{label}</span>
    </button>
  );
}

function SubHeader({ onBack, title, right }) {
  return (
    <div className="subheader">
      <BackBtn onClick={onBack}/>
      <div className="subheader-title">{title}</div>
      <div className="title-spacer">{right}</div>
    </div>
  );
}

function TabBar({ active, onTab, fabPosition='center' }) {
  return (
    <div className="tab-bar">
      <button className={`tab ${active==='top'?'active':''}`} onClick={()=>onTab('top')}>
        <Icon name="home" size={24} stroke={active==='top'?'var(--primary)':'var(--text-sub)'}/>
        <span>TOP</span>
      </button>
      <button className="tab center" onClick={()=>onTab('create')}>
        <span className="fab"><Icon name="plus" size={26} stroke="#fff" strokeWidth={2.4}/></span>
        <span className="tab-label">新規作成</span>
      </button>
      <button className={`tab ${active==='my'?'active':''}`} onClick={()=>onTab('my')}>
        <Icon name="user" size={24} stroke={active==='my'?'var(--primary)':'var(--text-sub)'}/>
        <span>マイページ</span>
      </button>
    </div>
  );
}

// ───────── Star button ─────────
function StarBtn({ on, onClick }) {
  return (
    <button className={`star-btn ${on?'starred':''}`} onClick={(e)=>{e.stopPropagation(); onClick();}} aria-label="お気に入り">
      <svg viewBox="0 0 24 24" fill={on?'var(--star-yellow)':'none'} stroke={on?'var(--star-yellow-border)':'#bbb'} strokeWidth="1.8" strokeLinejoin="round" strokeLinecap="round">
        <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6-5.4-2.9-5.4 2.9 1-6L3.2 9.5l6.1-.9L12 3z"/>
      </svg>
    </button>
  );
}

// ───────── card thumb resolver ─────────
function CardThumb({ card, size = 56, className = '' }) {
  const style = { width: size, height: size };
  if (card.type === 'illust' && card.illustSrc) {
    return <div className={`card-thumb ${className}`} style={{...style, backgroundImage:`url(${card.illustSrc})`, backgroundSize:'cover', backgroundPosition:'center', borderRadius:10, border:'1px solid var(--border)', backgroundColor:'#eafaf4'}}/>;
  }
  if (card.type === 'photo' && card.photoSrc) {
    return <div className={`card-thumb ${className}`} style={{...style, backgroundImage:`url(${card.photoSrc})`, backgroundSize:'cover', backgroundPosition:'center', borderRadius:10, border:'1px solid var(--border)'}}/>;
  }
  if (card.type === 'clock') {
    const h = String(card.clockTime?.h ?? 0).padStart(2,'0');
    const m = String(card.clockTime?.m ?? 0).padStart(2,'0');
    return <div className={`card-thumb ${className}`} style={{...style, borderRadius:10, border:'1px solid var(--border)', background:'#eafaf4', color:'var(--primary)', fontWeight:900, fontSize: size>50?16:13, display:'flex',alignItems:'center',justifyContent:'center', fontVariantNumeric:'tabular-nums'}}>{h}:{m}</div>;
  }
  // text type
  return <div className={`card-thumb ${className}`} style={{...style, borderRadius:10, border:'1px solid var(--border)', background:'#fafafa', color:'var(--text-muted)', display:'flex',alignItems:'center',justifyContent:'center'}}>
    <Icon name="text" size={size>50?22:18} stroke="var(--text-muted)"/>
  </div>;
}

// ═══════════════════════════════════════════════
// S1 — TOP
// ═══════════════════════════════════════════════
function ScreenTop({ scenes, onOpen, onEdit, onToggleFav, onTab, onAdd }) {
  const fav = scenes.filter(s=>s.isFavorite).sort((a,b)=>(b.favoriteSetAt||b.createdAt)-(a.favoriteSetAt||a.createdAt));
  const norm = scenes.filter(s=>!s.isFavorite).sort((a,b)=>(b.lastUsedAt||b.createdAt)-(a.lastUsedAt||a.createdAt));
  // ListRow shows the first card's thumbnail as the row icon (illust/photo/clock/text — handled by CardThumb)

  return (
    <div className="screen top-screen">
      <StatusBar/>
      <div className="screen-scroll">
        <div className="large-title-block">
          <h1 className="large-title">mitooshi</h1>
          <div className="large-subtitle">きょうのリストから、えらんでね</div>
        </div>
        <div className="section-label">
          <Icon name="star" size={14} fill="var(--star-yellow)" stroke="var(--star-yellow-border)" strokeWidth={1.6}/>
          よく使うリスト
        </div>
        {fav.length === 0 ? (
          <div className="empty-hint">
            <span className="empty-icon"><Icon name="star" size={16} stroke="var(--primary)"/></span>
            <span>★をタップすると、よく使うリストが上にきます。</span>
          </div>
        ) : (
          <div className="list-rows">
            {fav.map((s) => (
              <ListRow key={s.id} scene={s} variant="fav"
                       onOpen={onOpen} onEdit={onEdit} onToggleFav={onToggleFav}/>
            ))}
          </div>
        )}
        <div className="section-divider"/>
        <div className="section-label">そのほかのリスト</div>
        {norm.length === 0 ? (
          <div className="empty-hint">
            <span className="empty-icon"><Icon name="plus" size={16} stroke="var(--primary)"/></span>
            <span>＋ボタンから新しいリストをつくれます。</span>
          </div>
        ) : (
          <div className="list-rows">
            {norm.map((s) => (
              <ListRow key={s.id} scene={s} variant="normal"
                       onOpen={onOpen} onEdit={onEdit} onToggleFav={onToggleFav}/>
            ))}
          </div>
        )}
        <div style={{height:24}}/>
      </div>
      <TabBar active="top" onTab={onTab}/>
    </div>
  );
}

function ListRow({ scene, onOpen, onEdit, onToggleFav, variant }) {
  const [pressing, setPressing] = useState(false);
  const timerRef = useRef(null);
  const triggeredRef = useRef(false);

  const startPress = (e) => {
    if (e.target.closest('.star-btn') || e.target.closest('.edit-btn')) return;
    triggeredRef.current = false;
    timerRef.current = setTimeout(()=>{
      setPressing(true);
      timerRef.current = setTimeout(()=>{
        triggeredRef.current = true;
        setPressing(false);
        onEdit(scene);
      }, 400);
    }, 200);
  };
  const endPress = (e) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setPressing(false);
  };
  const handleClick = (e) => {
    if (e.target.closest('.star-btn') || e.target.closest('.edit-btn')) return;
    if (triggeredRef.current) return;
    onOpen(scene);
  };

  // Row icon = first card thumbnail (illust/photo/clock/text rendered by CardThumb).
  // Empty list (no cards) gets a soft dashed placeholder.
  const firstCard = scene.cards && scene.cards[0];
  const variantClass = variant === 'fav' ? 'is-fav' : variant === 'normal' ? 'is-normal' : '';

  return (
    <div className={`list-row ${variantClass} ${pressing?'long-pressing':''}`}
         onClick={handleClick}
         onMouseDown={startPress} onMouseUp={endPress} onMouseLeave={endPress}
         onTouchStart={startPress} onTouchEnd={endPress}>
      <StarBtn on={scene.isFavorite} onClick={()=>onToggleFav(scene.id)}/>
      {firstCard ? (
        <CardThumb card={firstCard} size={40} className="row-thumb"/>
      ) : (
        <span className="row-thumb-empty" aria-hidden="true">
          <Icon name="palette" size={18} stroke="var(--text-muted)"/>
        </span>
      )}
      <div className="row-name">{scene.name}</div>
      <button className="edit-btn" onClick={(e)=>{e.stopPropagation(); onEdit(scene);}} aria-label="編集">
        <Icon name="pencil" size={18}/>
      </button>
      <Icon name="chevron-right" size={18} stroke="var(--text-muted)" className="row-chev"/>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S2 — リスト新規作成
// ═══════════════════════════════════════════════
function ScreenNewList({ onBack, onSave, onTab }) {
  const [name, setName] = useState('');
  const valid = name.trim().length > 0 && name.length <= 20;
  return (
    <div className="screen">
      <StatusBar/>
      <SubHeader onBack={onBack} title="リストを新規作成する"/>
      <div className="form-page">
        <label className="field-label">リストのタイトル（20文字まで）</label>
        <input className="text-field" value={name} maxLength={20}
               onChange={(e)=>setName(e.target.value)}
               placeholder="例）あさのしたく" autoFocus/>
        <div className="char-counter">{name.length} / 20</div>
      </div>
      <div className="cta-bar">
        <button className="cta-button" disabled={!valid} onClick={()=>onSave(name.trim())}>
          保存してタスクを作る <Icon name="chevron-right" size={18} stroke="#fff" strokeWidth={2.2}/>
        </button>
      </div>
      <TabBar active="create" onTab={onTab}/>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S3 — カード種別選択
// ═══════════════════════════════════════════════
function ScreenCardType({ onBack, onPick, sceneName, onTab }) {
  const items = [
    { id: 'illust', icon: 'palette', title: 'イラストからえらぶ', sub: 'プリセットの絵カード' },
    { id: 'photo',  icon: 'camera',  title: '画像をアップロード', sub: '写真ライブラリから選択' },
    { id: 'clock',  icon: 'clock',   title: '時計をえらぶ', sub: '時刻を視覚化' },
    { id: 'text',   icon: 'text',    title: '文字を入力する', sub: 'ひらがな・カタカナ・漢字' },
  ];
  return (
    <div className="screen">
      <StatusBar/>
      <SubHeader onBack={onBack} title={sceneName}/>
      <div className="screen-scroll">
        <div className="section-label">カードの種類をえらんでね</div>
        <div className="cat-list">
          {items.map(it => (
            <button key={it.id} className="cat-btn" onClick={()=>onPick(it.id)}>
              <span className="cat-icon-wrap"><Icon name={it.icon} size={22} stroke="var(--primary)"/></span>
              <div className="cat-text">
                <div className="cat-title">{it.title}</div>
                <div className="cat-sub">{it.sub}</div>
              </div>
              <Icon name="chevron-right" size={18} stroke="var(--text-muted)" className="row-chev"/>
            </button>
          ))}
        </div>
      </div>
      <TabBar active="create" onTab={onTab}/>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S4a — イラスト選択
// ═══════════════════════════════════════════════
function ScreenIllust({ onBack, onPick, sceneName, onTab, illustLib }) {
  const [cat, setCat] = useState('一日');
  const cats = ['一日', '食事', 'おでかけ', 'おかいもの', '学校', 'ごほうび'];
  const filtered = illustLib.filter(i => i.cat === cat);
  return (
    <div className="screen">
      <StatusBar/>
      <SubHeader onBack={onBack} title={sceneName}/>
      <div className="screen-scroll">
        <div className="cat-chips">
          {cats.map(c => (
            <button key={c} className={`cat-chip ${cat===c?'active':''}`} onClick={()=>setCat(c)}>{c}</button>
          ))}
        </div>
        <div className="illust-grid">
          {filtered.map(it => (
            <button key={it.id} className="illust-cell" onClick={()=>onPick(it)}>
              <div className="img" style={{backgroundImage:`url(${it.src})`}}/>
              <div className="lbl">{it.label}</div>
            </button>
          ))}
        </div>
      </div>
      <TabBar active="create" onTab={onTab}/>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S4b — 写真アップ
// ═══════════════════════════════════════════════
function ScreenPhoto({ onBack, onSave, sceneName, onTab }) {
  const [src, setSrc] = useState(null);
  const [caption, setCaption] = useState('');
  const inputRef = useRef(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => setSrc(r.result);
    r.readAsDataURL(f);
  };
  const valid = src && caption.trim().length > 0;

  return (
    <div className="screen">
      <StatusBar/>
      <SubHeader onBack={onBack} title={sceneName}/>
      <div className="screen-scroll">
        <div className="section-label">写真を選択してください</div>
        <div className={`photo-slot ${src?'has-img':''}`}
             style={src?{backgroundImage:`url(${src})`}:{}}
             onClick={()=>inputRef.current?.click()}>
          {!src && <>
            <Icon name="camera" size={32} stroke="var(--text-muted)"/>
            <div style={{fontSize:13, fontWeight:600}}>タップして選択</div>
          </>}
        </div>
        <input ref={inputRef} type="file" accept="image/*" style={{display:'none'}} onChange={handleFile}/>
        <div style={{padding:'4px 16px 16px'}}>
          <button className="cat-btn" style={{justifyContent:'center'}} onClick={()=>inputRef.current?.click()}>
            <Icon name="image" size={20} stroke="var(--primary)"/>
            <div className="cat-title" style={{flex:'none'}}>{src?'写真を変更':'写真・画像を選択'}</div>
          </button>
        </div>
        <div style={{padding:'0 16px'}}>
          <label className="field-label">キャプション（16字まで）</label>
          <input className="text-field" value={caption} maxLength={16}
                 onChange={(e)=>setCaption(e.target.value)} placeholder="例）うちのかばん"/>
          <div className="char-counter">{caption.length} / 16</div>
        </div>
      </div>
      <div className="cta-bar">
        <button className="cta-button" disabled={!valid}
                onClick={()=>onSave({type:'photo', label: caption.trim(), photoSrc: src})}>
          保存する <Icon name="chevron-right" size={18} stroke="#fff" strokeWidth={2.2}/>
        </button>
      </div>
      <TabBar active="create" onTab={onTab}/>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S4c — 時計
// ═══════════════════════════════════════════════
function AnalogClock({ h, m }) {
  const minAng = (m / 60) * 360;
  const hourAng = ((h % 12) / 12) * 360 + (m / 60) * 30;
  return (
    <svg className="clock-svg" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="46" fill="#fff" stroke="var(--primary)" strokeWidth="2.5"/>
      {[...Array(12)].map((_, i) => {
        const a = (i * 30) * Math.PI/180;
        const x1 = 50 + Math.sin(a)*40, y1 = 50 - Math.cos(a)*40;
        const x2 = 50 + Math.sin(a)*44, y2 = 50 - Math.cos(a)*44;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--text-sub)" strokeWidth={i%3===0?2:1} strokeLinecap="round"/>;
      })}
      <line x1="50" y1="50" x2={50+Math.sin(hourAng*Math.PI/180)*22} y2={50-Math.cos(hourAng*Math.PI/180)*22} stroke="var(--text)" strokeWidth="3.5" strokeLinecap="round"/>
      <line x1="50" y1="50" x2={50+Math.sin(minAng*Math.PI/180)*32} y2={50-Math.cos(minAng*Math.PI/180)*32} stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round"/>
      <circle cx="50" cy="50" r="3" fill="var(--primary)"/>
    </svg>
  );
}

function ScreenClock({ onBack, onSave, sceneName, onTab }) {
  const [h, setH] = useState(8);
  const [m, setM] = useState(0);
  const [caption, setCaption] = useState('');
  const valid = caption.trim().length > 0;
  return (
    <div className="screen">
      <StatusBar/>
      <SubHeader onBack={onBack} title={sceneName}/>
      <div className="screen-scroll">
        <div className="section-label">時間を選択してください</div>
        <div className="clock-area">
          <AnalogClock h={h} m={m}/>
          <div className="clock-pickers">
            <select className="clock-select" value={h} onChange={(e)=>setH(Number(e.target.value))}>
              {Array.from({length:24}, (_, i) => <option key={i} value={i}>{String(i).padStart(2,'0')}</option>)}
            </select>
            <span className="clock-colon">:</span>
            <select className="clock-select" value={m} onChange={(e)=>setM(Number(e.target.value))}>
              {Array.from({length:12}, (_, i) => <option key={i*5} value={i*5}>{String(i*5).padStart(2,'0')}</option>)}
            </select>
          </div>
          <div className="clock-time-display">{String(h).padStart(2,'0')}:{String(m).padStart(2,'0')}</div>
        </div>
        <div style={{padding:'0 16px 16px'}}>
          <label className="field-label">キャプション（16字まで）</label>
          <input className="text-field" value={caption} maxLength={16}
                 onChange={(e)=>setCaption(e.target.value)} placeholder="例）ランドセルもってしゅっぱつ"/>
          <div className="char-counter">{caption.length} / 16</div>
        </div>
      </div>
      <div className="cta-bar">
        <button className="cta-button" disabled={!valid}
                onClick={()=>onSave({type:'clock', label: caption.trim(), clockTime:{h, m}})}>
          保存する <Icon name="chevron-right" size={18} stroke="#fff" strokeWidth={2.2}/>
        </button>
      </div>
      <TabBar active="create" onTab={onTab}/>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S4d — 文字
// ═══════════════════════════════════════════════
function ScreenText({ onBack, onSave, sceneName, onTab }) {
  const [text, setText] = useState('');
  const valid = text.trim().length > 0;
  return (
    <div className="screen">
      <StatusBar/>
      <SubHeader onBack={onBack} title={sceneName}/>
      <div className="form-page">
        <label className="field-label">テキストを入力（16字まで）</label>
        <input className="text-field" value={text} maxLength={16}
               onChange={(e)=>setText(e.target.value)} placeholder="例）ガソリンスタンドいく" autoFocus/>
        <div className="char-counter">{text.length} / 16</div>
        <div style={{marginTop:24, padding:14, background:'var(--bg-soft)', borderRadius:10, fontSize:12, color:'var(--text-sub)', lineHeight:1.6}}>
          ※ 画像なしの文字だけのカードです。<br/>
          時刻や予定の補足など、絵にしづらい予定に。
        </div>
      </div>
      <div className="cta-bar">
        <button className="cta-button" disabled={!valid}
                onClick={()=>onSave({type:'text', label: text.trim()})}>
          保存する <Icon name="chevron-right" size={18} stroke="#fff" strokeWidth={2.2}/>
        </button>
      </div>
      <TabBar active="create" onTab={onTab}/>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S4confirm — イラスト確認
// ═══════════════════════════════════════════════
function ScreenConfirm({ onBack, onSave, sceneName, onTab, draft }) {
  const [label, setLabel] = useState(draft?.label || '');
  const isPhoto = draft?.type === 'photo';
  const isIllust = draft?.type === 'illust';
  return (
    <div className="screen">
      <StatusBar/>
      <SubHeader onBack={onBack} title={sceneName}/>
      <div className="screen-scroll">
        <div style={{padding:'16px'}}>
          <div className="confirm-note">テキストを変更したい場合は、下の入力欄から修正してください。</div>
        </div>
        <div className="preview-stage">
          <div className={`preview-card ${isPhoto?'photo-only':''}`}>
            <div className="img" style={{backgroundImage: isIllust?`url(${draft.illustSrc})`: isPhoto?`url(${draft.photoSrc})`:'none'}}/>
            {!isPhoto && <div className="label-band">{label || draft?.label}</div>}
          </div>
        </div>
        {isIllust && (
          <div style={{padding:'0 24px 16px'}}>
            <label className="field-label">ラベル（16字まで）</label>
            <input className="text-field" value={label} maxLength={16} onChange={(e)=>setLabel(e.target.value)}/>
            <div className="char-counter">{label.length} / 16</div>
          </div>
        )}
      </div>
      <div className="cta-bar">
        <button className="cta-button" onClick={()=>onSave({...draft, label: (label || draft.label).trim()})}>
          保存する <Icon name="chevron-right" size={18} stroke="#fff" strokeWidth={2.2}/>
        </button>
      </div>
      <TabBar active="create" onTab={onTab}/>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S5 — リスト編集
// ═══════════════════════════════════════════════
function ScreenEdit({ onBack, onSave, sceneName, cards, onAddCard, onDeleteCard, onTab, askDelete, askDiscard, isNew }) {
  const [removingId, setRemovingId] = useState(null);
  const handleDelete = (id) => {
    askDelete(()=>{
      setRemovingId(id);
      setTimeout(()=>{
        onDeleteCard(id);
        setRemovingId(null);
      }, 280);
    });
  };
  const handleBack = () => {
    if (isNew && cards.length === 0) onBack(); // direct back
    else if (cards.length > 0) askDiscard(onBack);
    else onBack();
  };
  return (
    <div className="screen">
      <StatusBar/>
      <SubHeader onBack={handleBack} title={sceneName}/>
      <div className="screen-scroll">
        {cards.length === 0 ? (
          <div className="s5-empty">
            まだカードがありません。<br/>
            下の <strong style={{color:'var(--primary)'}}>＋</strong> でカードを追加してください。
          </div>
        ) : (
          <div className="edit-rows-pad">
            {cards.map((c, i) => (
              <div key={c.id} className={`edit-row ${removingId===c.id?'removing':''}`}>
                <button className="edit-row-btn delete" onClick={()=>handleDelete(c.id)} aria-label="削除">
                  <Icon name="trash" size={20} stroke="var(--danger)"/>
                </button>
                <CardThumb card={c} size={52}/>
                <div className="ed-label">{c.label || '(無題)'}</div>
                <button className="edit-row-btn" aria-label="並び替え">
                  <Icon name="menu" size={20} stroke="var(--text-sub)"/>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="s5-footer">
        <button className="add-card-btn" onClick={onAddCard} aria-label="カードを追加">
          <Icon name="plus" size={26} stroke="var(--primary)" strokeWidth={2.4}/>
        </button>
        <button className="cta-button" onClick={onSave} disabled={cards.length===0}>
          リストを保存する <Icon name="chevron-right" size={18} stroke="#fff" strokeWidth={2.2}/>
        </button>
      </div>
      <TabBar active="create" onTab={onTab}/>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S6 — 実行
// ═══════════════════════════════════════════════
function ScreenExec({ scene, doneIds, onTap, onBack, onComplete }) {
  const remaining = scene.cards.filter(c => !doneIds.has(c.id));
  const total = scene.cards.length;
  const done = total - remaining.length;
  const [fwapId, setFwapId] = useState(null);

  useEffect(() => {
    if (remaining.length === 0 && total > 0) {
      const t = setTimeout(onComplete, 400);
      return ()=>clearTimeout(t);
    }
  }, [remaining.length, total, onComplete]);

  const tap = (id) => {
    if (fwapId) return;
    // Visual + haptic confirmation
    setFwapId(id);
    if (navigator.vibrate) navigator.vibrate([12, 24, 12]);
    // Hand off to parent state slightly after the check fills,
    // and let CSS handle the slide-out via the .fwap class.
    setTimeout(()=>{
      onTap(id);
      setFwapId(null);
    }, 520);
  };

  return (
    <div className="screen exec-screen">
      <StatusBar/>
      <div className="subheader">
        <BackBtn onClick={onBack}/>
        <div className="subheader-title">{scene.name}</div>
        <div className="title-spacer">
          <div className="exec-progress">
            <span className="exec-progress-num">{done}</span>
            <span className="exec-progress-sep">/</span>
            <span className="exec-progress-tot">{total}</span>
          </div>
        </div>
      </div>
      <div className="exec-progressbar">
        <div className="exec-progressbar-fill" style={{width: `${total?Math.round(done/total*100):0}%`}}/>
      </div>
      <div className="exec-rows-pad">
        {scene.cards.map((c, idx) => {
          if (doneIds.has(c.id) && fwapId !== c.id) return null;
          const isActive = fwapId === c.id;
          // The "next up" task is the first remaining task; emphasize it.
          const isNext = !isActive && remaining[0] && remaining[0].id === c.id;
          return (
            <button key={c.id}
                    type="button"
                    className={`exec-row ${isActive?'is-checking':''} ${isNext?'is-next':''}`}
                    aria-pressed={isActive}
                    aria-label={`${c.label} を できた にする`}
                    onClick={()=>tap(c.id)}>
              <div className={`exec-check ${isActive?'is-checking':''}`}>
                <svg viewBox="0 0 24 24" className="exec-check-mark" aria-hidden="true">
                  <path d="M5 12.5 L10 17.5 L19 7.5" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <CardThumb card={c} size={56}/>
              <div className="exec-label">{c.label}</div>
              <div className="exec-row-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="18" height="18">
                  <path d="M9 6 L15 12 L9 18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </button>
          );
        })}
      </div>
      <div className="exec-hint">タップで「できた」になるよ</div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S7 — 完了
// ═══════════════════════════════════════════════
function ScreenComplete({ scene, onHome }) {
  const pieces = useMemo(()=>{
    const colors = ['var(--confetti-1)', 'var(--confetti-2)', 'var(--confetti-3)', 'var(--confetti-4)'];
    return Array.from({length:30}, (_, i)=>({
      id: i,
      left: Math.random()*100,
      delay: Math.random()*400,
      duration: 2000 + Math.random()*1500,
      w: 6 + Math.random()*6,
      h: 10 + Math.random()*8,
      color: colors[i % colors.length],
      rot: Math.random()*360,
    }));
  }, []);
  return (
    <div className="screen">
      <StatusBar/>
      <div className="complete-stage">
        {pieces.map(p => (
          <div key={p.id} className="confetti-piece" style={{
            left: `${p.left}%`, width: p.w, height: p.h, background: p.color,
            animationDuration: `${p.duration}ms`, animationDelay: `${p.delay}ms`,
            transform: `rotate(${p.rot}deg)`,
          }}/>
        ))}
        <div className="complete-check">
          <Icon name="check" size={72} stroke="#fff" strokeWidth={3.5}/>
        </div>
        <div className="complete-title">ぜんぶ できたね！</div>
        <div className="complete-sub">{scene.name} を クリア！</div>
        <button className="complete-home" onClick={onHome}>ホームに もどる</button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// S8 — マイページ
// ═══════════════════════════════════════════════
function ScreenMy({ profile, setProfile, onTab, sceneCount }) {
  return (
    <div className="screen">
      <StatusBar/>
      <div className="screen-scroll">
        <div className="large-title-block">
          <h1 className="large-title" style={{color:'var(--text)'}}>マイページ</h1>
          <div className="large-subtitle">設定とプロフィール</div>
        </div>

        <div className="section-label">プロフィール</div>
        <div className="settings-section">
          <div className="settings-list">
            <button className="settings-row">
              <span className="settings-icon"><Icon name="user" size={18}/></span>
              <span className="settings-label">子どもの名前</span>
              <span className="settings-value">{profile.childName || '未設定'}</span>
              <Icon name="chevron-right" size={16} stroke="var(--text-muted)"/>
            </button>
          </div>
        </div>

        <div className="section-label">アプリ設定</div>
        <div className="settings-section">
          <div className="settings-list">
            <div className="settings-row" style={{cursor:'default'}}>
              <span className="settings-icon"><Icon name="bell" size={18}/></span>
              <span className="settings-label">効果音</span>
              <button className={`toggle ${profile.soundEnabled?'on':''}`}
                      onClick={()=>setProfile({...profile, soundEnabled: !profile.soundEnabled})}/>
            </div>
            <button className="settings-row">
              <span className="settings-icon"><Icon name="diamond" size={18}/></span>
              <span className="settings-label">プラン</span>
              <span className="settings-value">無料プラン</span>
              <Icon name="chevron-right" size={16} stroke="var(--text-muted)"/>
            </button>
          </div>
        </div>

        <div className="section-label">情報</div>
        <div className="settings-section">
          <div className="settings-list">
            <button className="settings-row">
              <span className="settings-icon"><Icon name="doc" size={18}/></span>
              <span className="settings-label">プライバシーポリシー</span>
              <Icon name="chevron-right" size={16} stroke="var(--text-muted)"/>
            </button>
            <button className="settings-row">
              <span className="settings-icon"><Icon name="doc" size={18}/></span>
              <span className="settings-label">利用規約</span>
              <Icon name="chevron-right" size={16} stroke="var(--text-muted)"/>
            </button>
            <button className="settings-row">
              <span className="settings-icon"><Icon name="mail" size={18}/></span>
              <span className="settings-label">お問い合わせ</span>
              <Icon name="chevron-right" size={16} stroke="var(--text-muted)"/>
            </button>
          </div>
        </div>

        <div style={{padding:'24px 20px', textAlign:'center', fontSize:12, color:'var(--text-muted)'}}>
          mitooshi v1.0.0 — リスト{sceneCount}件
        </div>
      </div>
      <TabBar active="my" onTab={onTab}/>
    </div>
  );
}

// ═══════════════════════════════════════════════
// Onboarding (3 pages)
// ═══════════════════════════════════════════════
function Onboarding({ onDone, illustLib }) {
  const [step, setStep] = useState(0);
  const pages = [
    {
      title: 'みとおしを つくろう',
      body: '今日 やることを、上から順に カードで ならべます。子どもが ひと目で 次の行動を 思い出せます。',
      visual: illustLib[0]?.src,
    },
    {
      title: 'タップで すすめよう',
      body: '子どもが 自分で カードを タップ。ふわっと 消えていく感覚で、自走の 達成感を 感じます。',
      visual: illustLib[1]?.src,
    },
    {
      title: 'よく使うものは ★ で 上に',
      body: '☆を タップすると リストが 上に きます。家族の ルーティンを ひとつに まとめましょう。',
      visual: illustLib[2]?.src,
    },
  ];
  const cur = pages[step];
  return (
    <div className="screen">
      <StatusBar/>
      <div className="onb-stage">
        <div className="onb-illust">
          <div className="visual" style={cur.visual?{backgroundImage:`url(${cur.visual})`}:{}}/>
        </div>
        <div className="onb-title">{cur.title}</div>
        <div className="onb-body">{cur.body}</div>
        <div className="onb-dots">
          {pages.map((_, i) => <div key={i} className={`onb-dot ${i===step?'active':''}`}/>)}
        </div>
        <div className="onb-actions">
          <button className="onb-skip" onClick={onDone}>スキップ</button>
          <button className="onb-next" onClick={()=>{
            if (step < pages.length - 1) setStep(step + 1);
            else onDone();
          }}>{step < pages.length - 1 ? 'つぎへ' : 'はじめる'}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════
// App icon (for canvas display)
// ═══════════════════════════════════════════════
function AppIcon({ size = 120 }) {
  return (
    <div style={{width: size, height: size, borderRadius: size*0.22, overflow:'hidden', background:'linear-gradient(180deg, #00d4ad 0%, #00B894 100%)', boxShadow:'0 8px 20px rgba(0,184,148,0.35)', position:'relative'}}>
      <svg viewBox="0 0 120 120" width={size} height={size} style={{display:'block'}}>
        {/* checkmarks stack */}
        <rect x="22" y="30" width="76" height="14" rx="4" fill="rgba(255,255,255,0.95)"/>
        <path d="M30 37l4 4 8-8" stroke="#00B894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <rect x="22" y="52" width="76" height="14" rx="4" fill="rgba(255,255,255,0.95)"/>
        <path d="M30 59l4 4 8-8" stroke="#00B894" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <rect x="22" y="74" width="76" height="14" rx="4" fill="rgba(255,255,255,0.5)"/>
      </svg>
    </div>
  );
}

Object.assign(window, {
  ScreenTop, ScreenNewList, ScreenCardType, ScreenIllust, ScreenPhoto, ScreenClock, ScreenText,
  ScreenConfirm, ScreenEdit, ScreenExec, ScreenComplete, ScreenMy, Onboarding, AppIcon,
  CardThumb, AnalogClock, StatusBar, SubHeader, TabBar, BackBtn, ListRow, StarBtn,
});
