# Generates ALiS architecture diagram HTML (inline SVG, 1600x1000)
# 使い方: python3 scripts/thumbnails/alis-architecture.py && node scripts/thumbnails/shot.cjs 2 alis.png
# → PNG を WebP に変換して public/thumbnail_alis.webp に置く
W,H=1600,1000
BG="#111111"; SURF="#181818"; CARD="#151515"
T1="#ecebe8"; TB="#cfcdc8"; T2="#a4a29d"; TM="#6f6d69"
AC="#cbbf9f"; BD="rgba(255,255,255,0.10)"; BD2="rgba(255,255,255,0.16)"
SANS="Inter, 'Noto Sans JP', sans-serif"; MONO="'JetBrains Mono', monospace"
COL={"赤":"#d0574f","薄青":"#7f9ccc","薄緑":"#86b98a","シアン":"#4fb6bf","青":"#3f6fd1","緑":"#3c9a52","薄シアン":"#9fd3d6"}
o=[]
def t(x,y,s,size=14,fill=TB,w=400,fam=SANS,anchor="start",ls=0):
    o.append(f'<text x="{x}" y="{y}" font-family="{fam}" font-size="{size}" font-weight="{w}" fill="{fill}" text-anchor="{anchor}" letter-spacing="{ls}">{s}</text>')
def r(x,y,w,h,fill="none",stroke=BD,rx=10,sw=1,dash=None):
    d=f' stroke-dasharray="{dash}"' if dash else ""
    o.append(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"{d}/>')
def ln(x1,y1,x2,y2,stroke=BD2,sw=1,dash=None,marker=False):
    d=f' stroke-dasharray="{dash}"' if dash else ""
    m=' marker-end="url(#arr)"' if marker else ""
    o.append(f'<line x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}" stroke="{stroke}" stroke-width="{sw}"{d}{m}/>')

# header
t(60,78,"ALiS",40,T1,600,ls=-0.5)
t(160,78,"Arduino Light Signal System — System Architecture",20,T2,500)
t(60,114,"Wi-Fi も Bluetooth も使わず、光だけで文字を運ぶ 4 段リレー通信。　文字 → 距離 → 光モールス → 色 → 文字",16,TB)
# top-right badges
for i,(k,v) in enumerate([("MCU","Arduino × 4"),("Period","10 週"),("Team","4 人")]):
    x=1540-i*150
    t(x,64,k.upper(),11,TM,500,MONO,"end",1.5); t(x,90,v,17,T1,500,anchor="end")

# stages
SX=[60,456,852,1248]; SW=292; SY=160; SH=440
stages=[
 dict(n="01",title="符号化 / 距離送信",file="Proc01_Encode_IS1.ino",mcu="Arduino UNO R4",
      parts=[("SPI","L6470 モータドライバ","MODE3 · 8 MHz · 1/8 µstep"),
             ("MOTOR","ステッピングモータ + ベルト","障害物を直線移動"),
             ("LED","LED Matrix","入力・状態表示")],
      logic=["findPos(): 文字 → (row, col)","indexToStep(): ラベル → mm","mm[9] = 200 … 700 mm","step = mm × 200 × 8 / 60"]),
 dict(n="02",title="距離受信 / モールス送信",file="Proc02_IC1_LM2.ino",mcu="Arduino",
      parts=[("A0","GP2Y0A02YK 赤外線測距","アナログ距離 → ADC"),
             ("D9","レーザーモジュール","光モールス送信"),],
      logic=["th[10] で 8 区間 → 数字 0–7","th[0] 以上 = 開始 / th[9] 以下 = 終了","3 要素モールス符号化","Header ..---..  Footer .-.-. (AR)"]),
 dict(n="03",title="モールス受信 / 色送信",file="Proc03_LM2_FS3.ino",mcu="Arduino",
      parts=[("A0","NJL7502L 受光 (フォトTr)","LIGHT_THRESHOLD 500"),
             ("PWM","HV-5RGB60 フルカラー LED","R:9  G:3  B:11"),],
      logic=["エッジ検出 + 10 ms デバウンス","dot 0.7–2 UT / dash 2.5–4 UT","TIMEOUT 7 UT でリセット","数字 → 2 色ペア (300 / 100 ms)"]),
 dict(n="04",title="色受信 / 復号",file="Proc04_FS3_Decode.ino",mcu="Arduino",
      parts=[("I2C","TCS34725 カラーセンサ","IT 50 ms · Gain 4×"),
             ("USB","シリアルモニタ","復元した文字列を出力"),],
      logic=["R / G / B / C 4 値の区間判定","C ≤ 24 → 消灯 (COLOR_OFF)","状態機械で色ペア → 数字","(row, col) → 8×8 表の逆引き"]),
]
roles={1:"担当",2:"担当"}
for i,s in enumerate(stages):
    x=SX[i]
    mine = i in (1,2)
    r(x,SY,SW,SH,CARD,BD2 if mine else BD,12)
    t(x+22,SY+34,f"STAGE {s['n']}",12,AC if mine else TM,600,MONO,ls=2)
    if mine:
        t(x+SW-22,SY+34,"自分の担当",11,AC,500,anchor="end")
    t(x+22,SY+62,s["title"],19,T1,600)
    t(x+22,SY+84,s["file"],11.5,TM,400,MONO)
    # MCU chip
    cy=SY+102
    r(x+22,cy,SW-44,34,SURF,BD,6)
    # chip icon
    o.append(f'<rect x="{x+34}" y="{cy+9}" width="16" height="16" rx="2" fill="none" stroke="{T2}" stroke-width="1.3"/>')
    for k in range(3):
        yy=cy+12+k*5
        ln(x+30,yy,x+34,yy,T2,1.2); ln(x+50,yy,x+54,yy,T2,1.2)
    t(x+64,cy+22,s["mcu"],13.5,TB,500)
    t(x+SW-34,cy+22,"MCU",10.5,TM,500,MONO,"end",1.5)
    # bus line
    by=cy+34
    bx=x+42
    py=cy+50
    for j,(bus,name,sub) in enumerate(s["parts"]):
        yy=py+j*50
        ln(bx,by if j==0 else yy-50+20,bx,yy+20,BD2)
        ln(bx,yy+20,x+86,yy+20,BD2)
        r(x+86,yy,SW-108,40,"none",BD,6)
        t(x+98,yy+18,name,13,TB,500)
        t(x+98,yy+34,sub,11,TM,400,MONO if any(c.isdigit() for c in sub) else SANS)
        # bus tag
        t(x+58,yy+16,bus,9.5,AC,600,MONO,"middle",0.5)
    # logic
    ly=SY+SH-116
    ln(x+22,ly-14,x+SW-22,ly-14,BD)
    t(x+22,ly,"FIRMWARE",10.5,TM,600,MONO,ls=2)
    for j,l in enumerate(s["logic"]):
        t(x+22,ly+22+j*20,"·",13,AC,600)
        t(x+34,ly+22+j*20,l,12.5,T2,400)

# links between stages
links=[("赤外線 距離","障害物の位置","CER 4.73%","1.09 bit/s"),
       ("レーザー モールス","3 要素符号","CER 0.00%","12.5 bit/s"),
       ("フルカラー LED","2 色ペア","CER 0.00%","0.98 bit/s")]
LY=SY+214
for i,(a,b,c,d) in enumerate(links):
    x1=SX[i]+SW; x2=SX[i+1]
    cx=(x1+x2)/2
    # beam
    o.append(f'<line x1="{x1+6}" y1="{LY}" x2="{x2-8}" y2="{LY}" stroke="{AC}" stroke-width="1.6" stroke-dasharray="{"2 5" if i==1 else ("6 4" if i==0 else "10 4")}" marker-end="url(#arr)"/>')
    t(cx,LY-46,a.split()[0],12,T1,600,anchor="middle")
    t(cx,LY-29,a.split()[1],12,T1,600,anchor="middle")
    t(cx,LY-12,b,10.5,TM,400,anchor="middle")
    t(cx,LY+24,c,11,AC,500,MONO,"middle")
    t(cx,LY+40,d,10.5,TM,400,MONO,"middle")
# shielding note under links
t(1540,SY+SH+24,"各センサは黒段ボールで外乱光を遮光　·　受信 UNIT_TIME 80 ms",11.5,TM,400,anchor="end")

# DATA PATH row
DY=648
t(60,DY,"DATA PATH",11,TM,600,MONO,ls=2)
t(160,DY,"例: “ALiS” を送る",12.5,T2,400)
RY=DY+18; RH=104
digits=[0,0,1,3,4,2,2,2]
morse={0:"---",1:"--.",2:"-.-",3:"-..",4:".--",5:".-.",6:"..-",7:"..."}
pairs={0:("赤","薄青"),1:("赤","薄緑"),2:("赤","シアン"),3:("薄青","赤"),4:("薄青","薄緑"),5:("薄青","シアン"),6:("薄緑","赤"),7:("薄緑","薄青")}
for i in range(4):
    x=SX[i]
    r(x,RY,SW,RH,"none",BD,10,1,"3 4")
# stage1: chars -> pairs -> digits
x=SX[0]+20
t(x,RY+32,"A  L  i  S",20,T1,600,MONO,ls=1)
t(x+150,RY+30,"8×8 表で",11,TM)
t(x,RY+60,"(0,0) (1,3) (4,2) (2,2)",13,TB,500,MONO)
t(x,RY+86,"→ 0 0 1 3 4 2 2 2 を位置 (mm) に",12,T2,400)
# stage2: morse
x=SX[1]+20
t(x,RY+28,"Header  ..---..",12,TM,400,MONO)
ms=" ".join(morse[d] for d in digits[:4])
t(x,RY+54,ms,17,T1,600,MONO,ls=1)
t(x,RY+78," ".join(morse[d] for d in digits[4:]),17,T1,600,MONO,ls=1)
t(x+SW-40,RY+92,"Footer .-.-.",11,TM,400,MONO,"end")
# stage3: color chips
x=SX[2]+20
t(x,RY+26,"Header 青 · 区切り 薄シアン · Footer 緑",11,TM)
def chip(cx,cy,c,s=13):
    o.append(f'<rect x="{cx}" y="{cy}" width="{s}" height="{s}" rx="3" fill="{COL[c]}"/>')
cx=x; cy=RY+42
chip(cx,cy,"青"); cx+=22
for k,d in enumerate(digits):
    if k==4: cx=x+22; cy+=26
    a,b=pairs[d]; chip(cx,cy,a); chip(cx+15,cy,b); cx+=34
    if k not in (3,7): chip(cx-2,cy+3,"薄シアン",7); cx+=10
chip(cx+2,cy,"緑")
# stage4: output
x=SX[3]+20
t(x,RY+30,"0 0 1 3 4 2 2 2",13,TB,500,MONO)
t(x,RY+50,"→ 2 個ずつ (row, col) で逆引き",11.5,TM)
t(x,RY+86,"ALiS",26,AC,600,MONO,ls=1)
t(x+92,RY+84,"受信完了",12,T2)

# bottom: codebook + metrics
BY=806
t(60,BY,"SHARED CODEBOOK",11,TM,600,MONO,ls=2)
t(60,BY+18,"段 1 と段 4 が共有する 8×8 テーブル",11.5,T2)
glyph=["ABCDEFGH","IJKLMNOP","QRSTUVWX","YZabcdef","ghijklmn","opqrstuv","wxyz!?.,",":;-_@$% "]
hl={(0,0),(1,3),(4,2),(2,2)}
gx,gy,cs=330,BY-14,20
for rr in range(8):
    for cc in range(8):
        h=(rr,cc) in hl
        ch=glyph[rr][cc]
        if h: o.append(f'<rect x="{gx+cc*cs}" y="{gy+rr*cs}" width="{cs-2}" height="{cs-2}" rx="3" fill="rgba(203,191,159,0.18)" stroke="{AC}" stroke-width="1"/>')
        t(gx+cc*cs+9,gy+rr*cs+14,ch if ch!=" " else "␣",11.5,AC if h else T2,600 if h else 400,MONO,"middle")
for k in range(8):
    t(gx-10,gy+k*cs+14,str(k),9.5,TM,400,MONO,"end")
    t(gx+k*cs+9,gy-6,str(k),9.5,TM,400,MONO,"middle")
t(60,BY+52,"row",10.5,TM,400,MONO); t(60,BY+70,"col",10.5,TM,400,MONO)
t(100,BY+52,"0 – 7  (3 bit)",12,TB,400,MONO); t(100,BY+70,"0 – 7  (3 bit)",12,TB,400,MONO)
t(60,BY+104,"中継の各段は数字を運ぶだけ。",12,T2)
t(60,BY+124,"意味を知っているのは両端だけ。",12,T2)

# metrics
mx=560
t(mx,BY,"EVALUATION",11,TM,600,MONO,ls=2)
t(mx,BY+18,"CER (文字誤り率) · 目標 25% 以下",11.5,T2)
rows=[("システム全体","4.73%","0.15 bit/s",True),("段 1–2  赤外線距離","4.73%","1.09 bit/s",False),("段 2–3  光モールス","0.00%","12.5 bit/s",False),("段 3–4  フルカラー LED","0.00%","0.98 bit/s",False)]
for j,(a,b,c,strong) in enumerate(rows):
    yy=BY+50+j*28
    t(mx,yy,a,13,T1 if strong else TB,600 if strong else 400)
    t(mx+300,yy,b,13,AC if (b=="0.00%" or strong) else TB,600,MONO,"end")
    t(mx+420,yy,c,12,TM,400,MONO,"end")
    ln(mx,yy+10,mx+420,yy+10,"rgba(255,255,255,0.06)")
# right: tech stack summary
rx=1080
t(rx,BY,"HARDWARE / BUS",11,TM,600,MONO,ls=2)
items=[("SPI","L6470 stepper driver"),("ADC","GP2Y0A02YK · NJL7502L"),("PWM","Laser · HV-5RGB60"),("I2C","TCS34725 color sensor"),("C++","Arduino IDE × 4 sketches")]
for j,(a,b) in enumerate(items):
    yy=BY+28+j*24
    t(rx,yy,a,11,AC,600,MONO)
    t(rx+48,yy,b,12.5,TB,400)
t(1540,BY+156,"オープンキャンパス学科ブース展示",11.5,TM,400,anchor="end")

svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">
<defs><marker id="arr" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="{AC}"/></marker>
<radialGradient id="glow" cx="50%" cy="0%" r="70%"><stop offset="0" stop-color="#ffffff" stop-opacity="0.035"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient></defs>
<rect width="{W}" height="{H}" fill="{BG}"/><rect width="{W}" height="{H}" fill="url(#glow)"/>
{"".join(o)}
</svg>'''
html=f'''<!doctype html><html><head><meta charset="utf-8">
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>html,body{{margin:0;background:{BG}}}</style></head><body>{svg}</body></html>'''
open(__file__.replace("gen.py","alis.html"),"w").write(html)
