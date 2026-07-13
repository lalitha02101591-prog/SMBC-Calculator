
// ==========================================
// SMBC Calculator v2.0
// Dynamic UI + SMBC Engine
// ==========================================

const titles=["SD","SN","MD","MN","RJD","RJN","KD","KN","TB","NTB","MBZ"];
const subtitles=["05","16","27","38","49"];

const inputArea=document.getElementById("inputArea");
const resultArea=document.getElementById("resultArea");

titles.forEach(title=>{
  const section=document.createElement("div");
  section.className="section";

  const header=document.createElement("div");
  header.className="sectionHeader";
  header.textContent=title;

  const body=document.createElement("div");
  body.className="sectionBody";

  subtitles.forEach(sub=>{
    const block=document.createElement("div");
    block.className="subtitleBlock";

    const label=document.createElement("label");
    label.textContent=`${title} ${sub}`;

    const textarea=document.createElement("textarea");
    textarea.id=`${title}_${sub}`;
    textarea.placeholder="Example: 45,32,68,98,35";

    block.appendChild(label);
    block.appendChild(textarea);
    body.appendChild(block);
  });

  header.onclick=()=>body.style.display=
      body.style.display==="block"?"none":"block";

  section.appendChild(header);
  section.appendChild(body);
  inputArea.appendChild(section);
});

function parseInput(text){
  return text.split(",")
    .map(x=>x.trim())
    .filter(x=>x!=="")
    .map(Number)
    .filter(n=>!isNaN(n));
}

function fmt(n){
  return (n>=0 && n<10)?("0"+n):String(n);
}

function generatePairs(arr){
  const out=[];
  for(let i=0;i<arr.length;i++){
    for(let j=i+1;j<arr.length;j++){
      out.push([arr[i],arr[j]]);
    }
  }
  return out;
}

function createPairBlock(a,b){
  const c=a+b;
  const d=Math.abs(a-b);

  const add=[c+a,c+b,d+a,d+b];
  const sub=[
    Math.abs(c-a),
    Math.abs(c-b),
    Math.abs(d-a),
    Math.abs(d-b)
  ];

  const block=document.createElement("div");
  block.className="pairBlock";
  block.style.border="1px solid #999";
  block.style.margin="15px 0";
  block.style.padding="12px";
  block.style.background="#fff";

  block.innerHTML=`
    <div style="font-weight:bold;font-size:18px">${fmt(a)} &amp; ${fmt(b)}</div>
    <div style="text-align:center;font-size:22px;font-weight:bold;margin:8px 0">
    ${fmt(c)}
    <br>
    ${fmt(d)}
</div>

    <table style="width:100%;border-collapse:collapse">
      <tr>
        <th>(+)</th>
        <th>(-)</th>
      </tr>
      <tr><td>${fmt(add[0])}</td><td>${fmt(sub[0])}</td></tr>
      <tr><td>${fmt(add[1])}</td><td>${fmt(sub[1])}</td></tr>
      <tr><td>${fmt(add[2])}</td><td>${fmt(sub[2])}</td></tr>
      <tr><td>${fmt(add[3])}</td><td>${fmt(sub[3])}</td></tr>
    </table>
  `;
  return block;
}

function calculateAll(){
  resultArea.innerHTML="";

  titles.forEach(title=>{
    subtitles.forEach(sub=>{
      const nums=parseInput(document.getElementById(`${title}_${sub}`).value);
      if(nums.length<2) return;

      const h=document.createElement("h2");
      h.textContent=`${title} ${sub}`;
      resultArea.appendChild(h);

      const pairs=generatePairs(nums);
      pairs.forEach(([a,b])=>{
        resultArea.appendChild(createPairBlock(a,b));
      });
    });
  });
}

document.getElementById("calculateBtn").onclick=calculateAll;

document.getElementById("clearBtn").onclick=()=>{
  document.querySelectorAll("textarea").forEach(t=>t.value="");
  resultArea.innerHTML="";
};
