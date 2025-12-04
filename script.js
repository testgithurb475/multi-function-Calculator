const out = document.getElementById('output');
function write(line){ out.innerHTML += line + "\n"; }
function clearOut(){ out.innerHTML = ''; }

document.getElementById('clearBtn').addEventListener('click', clearOut);
document.getElementById('startBtn').addEventListener('click', main);

alert('Welcome! Choose the function you want calculate.');

async function main(){
  try{
    const menu = `Choose operation (type number):\n1) Basic arithmetic\n2) Percentage\n3) Temperature conversion\n4) Currency conversion\n5) Age calculation\n6) Geometry calculations\n7) Lifetime supply calculator\n0) Exit`;

    while(true){
      const choice = prompt(menu + "\nEnter number:");
      if(choice === null){ write('User cancelled.'); break; }

      switch(choice.trim()){
        case '1': basicArithmetic(); break;
        case '2': percentageCalc(); break;
        case '3': tempConvert(); break;
        case '4': await currencyConvert(); break;
        case '5': ageCalculate(); break;
        case '6': geometryMenu(); break;
        case '7': lifetimeSupply(); break;
        case '0': write('Exited.'); return;
        default: write('Invalid choice: ' + choice);
      }

      const again = prompt('Do another operation? (y/n)');
      if(!again || again.toLowerCase().startsWith('n')){ write('Finished session.'); break; }
    }
  }catch(e){ write('Error: ' + e.message); }
}

function toNumber(x){
  const n = Number(x);
  if(Number.isFinite(n)) return n;
  throw new Error('Invalid number: ' + x);
}

function basicArithmetic(){
  try{
    const a = toNumber(prompt('Enter first number:'));
    const b = toNumber(prompt('Enter second number:'));
    const op = prompt('Choose operator (+ - * /):');
    let res;

    switch(op){
      case '+': res = a + b; break;
      case '-': res = a - b; break;
      case '*': res = a * b; break;
      case '/':
        if(b === 0) throw new Error('Division by zero');
        res = a / b;
        break;
      default: throw new Error('Unknown operator');
    }

    write(`Arithmetic: ${a} ${op} ${b} = ${res}`);
  }catch(e){ write('Arithmetic error: ' + e.message); }
}

function percentageCalc(){
  try{
    const mode = prompt('Percentage mode:\n1) What is X% of Y?\n2) X is what percent of Y?');

    if(mode === '1'){
      const x = toNumber(prompt('Enter X (percent):'));
      const y = toNumber(prompt('Enter Y (value):'));
      write(`${x}% of ${y} = ${(x/100)*y}`);
    }
    else if(mode === '2'){
      const x = toNumber(prompt('Enter X (part):'));
      const y = toNumber(prompt('Enter Y (whole):'));
      write(`${x} is ${(x/y)*100}% of ${y}`);
    }
    else write('Invalid mode');
  }catch(e){ write('Percentage error: ' + e.message); }
}

function tempConvert(){
  try{
    const mode = prompt('1) C → F\n2) F → C');
    if(mode === '1'){
      const c = toNumber(prompt('Enter °C:'));
      write(`${c}°C = ${(c*9/5)+32}°F`);
    }
    else if(mode === '2'){
      const f = toNumber(prompt('Enter °F:'));
      write(`${f}°F = ${(f-32)*5/9}°C`);
    }
    else write('Invalid mode');
  }catch(e){ write('Temperature error: ' + e.message); }
}

async function currencyConvert(){
  try{
    const from = (prompt('From currency (USD, EUR, etc.):')||'').toUpperCase();
    const to = (prompt('To currency:')||'').toUpperCase();
    const amount = toNumber(prompt('Amount:'));

    const apiUrl = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
    write(`Fetching live rate for ${from} → ${to} ...`);

    try{
      const res = await fetch(apiUrl);
      const data = await res.json();

      if(data && data.result != null){
        write(`${amount} ${from} = ${data.result} ${to} (rate: ${data.info.rate})`);
        return;
      }
      throw new Error('API returned invalid data');
    }
    catch(err){
      write('Live rate failed, switching to manual.');
      const rate = toNumber(prompt(`Enter rate manually (1 ${from} = ? ${to}):`));
      write(`${amount} ${from} = ${amount*rate} ${to} (manual rate)`);
    }
  }catch(e){ write('Currency error: ' + e.message); }
}

function ageCalculate(){
  try{
    const dob = prompt('Enter DOB (YYYY-MM-DD):');
    if(!dob) return write('Cancelled.');

    const [Y,M,D] = dob.split('-').map(Number);
    const birth = new Date(Y, M-1, D);
    const today = new Date();

    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if(m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

    write(`DOB: ${birth.toDateString()} → Age: ${age} years`);
  }catch(e){ write('Age error: ' + e.message); }
}

function geometryMenu(){
  try{
    const g = prompt('Geometry:\n1) Circle\n2) Rectangle\n3) Triangle');

    if(g === '1'){
      const r = toNumber(prompt('Radius:'));
      write(`Circle r=${r} → area=${Math.PI*r*r}, circumference=${2*Math.PI*r}`);
    }
    else if(g === '2'){
      const w = toNumber(prompt('Width:'));
      const h = toNumber(prompt('Height:'));
      write(`Rectangle ${w}×${h} → area=${w*h}, perimeter=${2*(w+h)}`);
    }
    else if(g === '3'){
      const b = toNumber(prompt('Base:'));
      const h = toNumber(prompt('Height:'));
      write(`Triangle → area=${0.5*b*h}`);
    }
    else write('Invalid');
  }catch(e){ write('Geometry error: ' + e.message); }
}

function lifetimeSupply(){
  try{
    const age = toNumber(prompt('Current age:'));
    const daily = toNumber(prompt('Units per day:'));
    const max = toNumber(prompt('Expected max age:'));

    if(max <= age) throw new Error('Max age must be greater');

    const yearsLeft = max - age;
    const total = Math.round(daily * 365 * yearsLeft);

    write(`To last until age ${max}, you need approx. ${total} units.`);
  }catch(e){ write('Lifetime supply error: ' + e.message); }
}