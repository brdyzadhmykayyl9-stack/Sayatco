import React, { useMemo, useState } from 'react';
import { Alert, Linking, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, Image } from 'react-native';

// اطلاعات رسمی شرکت را اینجا وارد کنید.
const CONTACT = { phone: '09113748915', whatsapp: '989113748915', email: '' };
const products = [
  ['disc', 'دیسک پشت تراکتور', 'پیکربندی عرض، شاسی، دیسک، چرخ و آپشن‌ها.'],
  ['custom', 'ساخت سفارشی', 'ثبت نیاز اولیه برای تجهیز اختصاصی پروژه.'],
];
const widths = [1800, 2000, 2200, 2500, 2800, 3000];
const frames = [['standard', 'شاسی استاندارد'], ['heavy', 'شاسی سنگین']];
const discs = [['d560x4', 'Ø560 × 4 mm'], ['d560x6', 'Ø560 × 6 mm']];
const wheels = [['10/80-12', '10/80-12'], ['340/55-16', '340/55-16']];

export default function App() {
  const [page, setPage] = useState('home');
  const [step, setStep] = useState(0);
  const [machine, setMachine] = useState('disc');
  const [width, setWidth] = useState(2500), [frame, setFrame] = useState('standard');
  const [disc, setDisc] = useState('d560x4'), [wheel, setWheel] = useState('10/80-12');
  const [hyd, setHyd] = useState(false), [led, setLed] = useState(false), [skf, setSkf] = useState(false);
  const [name, setName] = useState(''), [phone, setPhone] = useState(''), [notes, setNotes] = useState('');

  const check = useMemo(() => {
    const reasons = [];
    if (width >= 3000 && frame === 'standard') reasons.push('برای عرض 3000 میلی‌متر، شاسی سنگین لازم است.');
    if (disc === 'd560x6' && frame === 'standard') reasons.push('دیسک 6 میلی‌متر با شاسی استاندارد در این نسخه مجاز نیست.');
    return { ok: reasons.length === 0, reasons };
  }, [width, frame, disc]);

  const reset = () => { setStep(0); setMachine('disc'); setWidth(2500); setFrame('standard'); setDisc('d560x4'); setWheel('10/80-12'); setHyd(false); setLed(false); setSkf(false); setPage('custom'); };
  const submit = () => {
    if (!check.ok) return Alert.alert('نیازمند بررسی فنی', check.reasons.join('\n'));
    if (!name.trim() || !phone.trim()) return Alert.alert('اطلاعات ناقص', 'لطفاً نام و شماره تماس را وارد کنید.');
    Alert.alert('درخواست آماده شد', 'اطلاعات درخواست در این نسخه آماده پیگیری است. برای اتصال واقعی به سامانه فروش، API یا واتساپ باید اطلاعات رسمی شرکت اضافه شود.');
  };
  const contact = async (type) => {
    const value = CONTACT[type];
    if (!value) return Alert.alert('اطلاعات تماس', 'اطلاعات رسمی این راه ارتباطی هنوز در App.js وارد نشده است.');
    const url = type === 'email' ? `mailto:${value}` : type === 'whatsapp' ? `https://wa.me/${value}` : `tel:${value}`;
    try { await Linking.openURL(url); } catch { Alert.alert('خطا', 'امکان باز کردن این راه ارتباطی وجود ندارد.'); }
  };

  return <SafeAreaView style={s.safe}>
    <StatusBar barStyle="dark-content" />
    <ScrollView contentContainerStyle={s.container}>
      <Header onHome={() => setPage('home')} />
      {page === 'home' && <Home goCustom={reset} goCatalog={() => setPage('catalog')} goContact={() => setPage('contact')} />}
      {page === 'catalog' && <Catalog goCustom={reset} />}
      {page === 'contact' && <Contact name={name} phone={phone} notes={notes} setName={setName} setPhone={setPhone} setNotes={setNotes} submit={submit} contact={contact} />}
      {page === 'custom' && <Configurator {...{step,setStep,machine,setMachine,width,setWidth,frame,setFrame,disc,setDisc,wheel,setWheel,hyd,setHyd,led,setLed,skf,setSkf,check,name,phone,notes,setName,setPhone,setNotes,submit}} back={() => setPage('home')} />}
      <Footer goCatalog={() => setPage('catalog')} goContact={() => setPage('contact')} />
    </ScrollView>
  </SafeAreaView>;
}

function Header({onHome}) { return <View style={s.header}><Pressable onPress={onHome} style={s.logo}><Image source={require('./assets/sayat-logo.png')} style={s.logoImage} resizeMode='contain'/></Pressable><View style={{flex:1,marginRight:12}}><Text style={s.brand}>گروه صنعتی سایات</Text><Text style={s.muted}>راهکارهای صنعتی و ساخت سفارشی</Text></View></View>; }
function Home({goCustom,goCatalog,goContact}) { return <View>
  <View style={s.homeLogoWrap}><Image source={require('./assets/sayat-logo.png')} style={s.homeLogo} resizeMode='contain'/></View>
  <View style={s.hero}><Text style={s.eyebrow}>SAYAT INDUSTRIAL GROUP</Text><Text style={s.heroTitle}>از ایده تا ساخت،{`\n`}سفارشی برای نیاز شما</Text><Text style={s.heroText}>با SAYAT CUSTOM مشخصات اولیه تجهیز را مرحله‌به‌مرحله انتخاب کنید و یک درخواست ساخت منظم ایجاد کنید.</Text><Button title="شروع طراحی سفارشی" onPress={goCustom}/><Outline title="مشاهده محصولات" onPress={goCatalog}/></View>
  <Title t="فرآیند کار" sub="چهار مرحله برای رسیدن به مشخصات اولیه محصول" />
  {[['01','انتخاب محصول','نوع دستگاه و کاربرد را مشخص کنید.'],['02','پیکربندی فنی','عرض، شاسی، دیسک، چرخ و آپشن‌ها را انتخاب کنید.'],['03','بررسی فنی','محدودیت‌های پایه پیکربندی بررسی می‌شوند.'],['04','درخواست ساخت','مشخصات برای پیگیری فروش و تولید آماده می‌شود.']].map(x=><View style={s.feature} key={x[0]}><Text style={s.num}>{x[0]}</Text><View style={{flex:1}}><Text style={s.featureTitle}>{x[1]}</Text><Text style={s.muted}>{x[2]}</Text></View></View>)}
  <Info title="ساخت سفارشی سایات">این نسخه پایهٔ اولیه است. مشخصات فنی و محدودیت‌ها باید پیش از تولید توسط واحد فنی شرکت تأیید شوند.</Info><Button title="درخواست مشاوره و تماس" onPress={goContact}/>
</View>; }
function Catalog({goCustom}) { return <View><Title t="محصولات و خدمات" sub="بخش محصولات واقعی شرکت می‌تواند در مرحله بعد تکمیل شود." />{products.map(p=><View style={s.card} key={p[0]}><View style={s.icon}><Text style={s.logoText}>S</Text></View><Text style={s.cardTitle}>{p[1]}</Text><Text style={s.muted}>{p[2]}</Text><Pressable onPress={goCustom}><Text style={s.link}>شروع پیکربندی ←</Text></Pressable></View>)}<Info title="قابل توسعه">تصاویر محصولات، کاتالوگ PDF، مشخصات فنی و قیمت‌گذاری می‌توانند به این بخش اضافه شوند.</Info></View>; }

function Configurator(p) {
  const next=()=>p.step<5?p.setStep(p.step+1):p.submit(); const prev=()=>p.step>0?p.setStep(p.step-1):p.back();
  return <View><Title t="SAYAT CUSTOM" sub="پیکربندی اولیه دستگاه"/><View style={s.track}><View style={[s.fill,{width:`${(p.step+1)/6*100}%`}]}/></View><Text style={[s.muted,{textAlign:'right',marginTop:7}]}>مرحله {p.step+1} از 6</Text>
    {p.step===0&&<Step t="نوع دستگاه">{products.map(x=><Choice key={x[0]} label={x[1]} selected={p.machine===x[0]} onPress={()=>p.setMachine(x[0])}/>)}</Step>}
    {p.step===1&&<Step t="عرض کاری"><View style={s.grid}>{widths.map(x=><Choice key={x} small label={`${x} mm`} selected={p.width===x} onPress={()=>p.setWidth(x)}/>)}</View></Step>}
    {p.step===2&&<Step t="شاسی">{frames.map(x=><Choice key={x[0]} label={x[1]} selected={p.frame===x[0]} onPress={()=>p.setFrame(x[0])}/>)}</Step>}
    {p.step===3&&<Step t="دیسک و چرخ"><Text style={s.group}>نوع دیسک</Text><View style={s.grid}>{discs.map(x=><Choice key={x[0]} small label={x[1]} selected={p.disc===x[0]} onPress={()=>p.setDisc(x[0])}/>)}</View><Text style={s.group}>نوع چرخ</Text><View style={s.grid}>{wheels.map(x=><Choice key={x[0]} small label={x[1]} selected={p.wheel===x[0]} onPress={()=>p.setWheel(x[0])}/>)}</View></Step>}
    {p.step===4&&<Step t="آپشن‌ها"><Toggle label="تنظیم هیدرولیکی چرخ" value={p.hyd} set={p.setHyd}/><Toggle label="چراغ و علائم هشدار" value={p.led} set={p.setLed}/><Toggle label="توپی SKF" value={p.skf} set={p.setSkf}/></Step>}
    {p.step===5&&<Step t="خلاصه و اطلاعات درخواست"><View style={s.summary}><Line a="دستگاه" b={p.machine==='disc'?'دیسک پشت تراکتور':'ساخت سفارشی'}/><Line a="عرض کاری" b={`${p.width} mm`}/><Line a="شاسی" b={p.frame==='heavy'?'سنگین':'استاندارد'}/><Line a="دیسک" b={p.disc==='d560x6'?'Ø560 × 6 mm':'Ø560 × 4 mm'}/><Line a="چرخ" b={p.wheel}/><Line a="آپشن‌ها" b={[p.hyd&&'هیدرولیک',p.led&&'LED',p.skf&&'SKF'].filter(Boolean).join('، ')||'بدون آپشن'}/></View><View style={[s.status,p.check.ok?s.ok:s.warn]}><Text style={s.statusTitle}>{p.check.ok?'✓ پیکربندی پایه قابل بررسی است':'⚠ نیازمند بررسی فنی'}</Text>{p.check.reasons.map(r=><Text key={r} style={s.reason}>• {r}</Text>)}</View><Text style={s.group}>اطلاعات متقاضی</Text><Input value={p.name} set={p.setName} ph="نام و نام خانوادگی"/><Input value={p.phone} set={p.setPhone} ph="شماره تماس" phone/><Input value={p.notes} set={p.setNotes} ph="توضیحات یا نیاز فنی (اختیاری)" multi/></Step>}
    <Button title={p.step===5?'ثبت درخواست':'ادامه'} onPress={next} disabled={p.step===5&&!p.check.ok}/><Outline title={p.step===0?'بازگشت به خانه':'مرحله قبل'} onPress={prev}/>
  </View>;
}
function Contact(p){return <View><Title t="تماس و درخواست مشاوره" sub="اطلاعات تماس را وارد کنید تا درخواست آماده پیگیری شود."/><Input value={p.name} set={p.setName} ph="نام و نام خانوادگی"/><Input value={p.phone} set={p.setPhone} ph="شماره تماس" phone/><Input value={p.notes} set={p.setNotes} ph="موضوع یا توضیحات" multi/><Button title="ثبت درخواست" onPress={p.submit}/><Text style={s.group}>ارتباط مستقیم</Text><Outline title="تماس تلفنی" onPress={()=>p.contact('phone')}/><Outline title="واتساپ" onPress={()=>p.contact('whatsapp')}/><Outline title="ایمیل" onPress={()=>p.contact('email')}/></View>;}
function Step({t,children}){return <View><Text style={s.title}>{t}</Text>{children}</View>;} function Title({t,sub}){return <View><Text style={s.title}>{t}</Text><Text style={s.subtitle}>{sub}</Text></View>;}
function Choice({label,selected,onPress,small}){return <Pressable onPress={onPress} style={[s.choice,small&&s.small,selected&&s.selected]}><Text style={[s.choiceText,selected&&s.white]}>{selected?'✓  ':''}{label}</Text></Pressable>;}
function Toggle({label,value,set}){return <Pressable onPress={()=>set(!value)} style={[s.choice,value&&s.selected]}><Text style={[s.choiceText,value&&s.white]}>{value?'✓  ':''}{label}</Text></Pressable>;}
function Line({a,b}){return <View style={s.line}><Text style={s.label}>{a}</Text><Text style={s.value}>{b}</Text></View>;}
function Input({value,set,ph,phone,multi}){return <TextInput value={value} onChangeText={set} placeholder={ph} placeholderTextColor="#89958f" keyboardType={phone?'phone-pad':'default'} multiline={multi} style={[s.input,multi&&s.multi]} textAlign="right"/>;}
function Info({title,children}){return <View style={s.info}><Text style={s.infoTitle}>{title}</Text><Text style={s.infoText}>{children}</Text></View>;}
function Button({title,onPress,disabled}){return <Pressable disabled={disabled} onPress={onPress} style={[s.button,disabled&&{opacity:.45}]}><Text style={s.buttonText}>{title}</Text></Pressable>;}
function Outline({title,onPress}){return <Pressable onPress={onPress} style={s.outline}><Text style={s.outlineText}>{title}</Text></Pressable>;}
function Footer({goCatalog,goContact}){return <View style={s.footer}><Text style={s.footerBrand}>SAYAT</Text><Text style={s.muted}>گروه صنعتی سایات</Text><View style={s.footerLinks}><Pressable onPress={goCatalog}><Text style={s.link}>محصولات</Text></Pressable><Pressable onPress={goContact}><Text style={s.link}>تماس</Text></Pressable></View><Text style={s.footerNote}>نسخه اولیه اپلیکیشن — تأیید نهایی مشخصات با واحد فنی شرکت است.</Text></View>;}

const s=StyleSheet.create({
 safe:{flex:1,backgroundColor:'#f3f6f4'},container:{padding:18,paddingBottom:45,maxWidth:720,width:'100%',alignSelf:'center'},header:{flexDirection:'row-reverse',alignItems:'center',marginBottom:16},logo:{width:52,height:52,borderRadius:14,backgroundColor:'#111a16',alignItems:'center',justifyContent:'center',overflow:'hidden'},logoImage:{width:48,height:48},homeLogoWrap:{alignItems:'center',justifyContent:'center',marginBottom:10},homeLogo:{width:150,height:150},logoText:{color:'#fff',fontSize:27,fontWeight:'900'},brand:{fontSize:19,fontWeight:'900',color:'#111a16',textAlign:'right'},muted:{color:'#6b7771',lineHeight:22,textAlign:'right'},hero:{backgroundColor:'#111a16',borderRadius:26,padding:24,marginBottom:26},eyebrow:{color:'#b9c5bf',fontSize:12,fontWeight:'800',textAlign:'right'},heroTitle:{color:'#fff',fontSize:31,lineHeight:40,fontWeight:'900',marginTop:12,textAlign:'right'},heroText:{color:'#d3dbd6',lineHeight:25,marginTop:12,textAlign:'right'},title:{fontSize:25,lineHeight:33,fontWeight:'900',color:'#111a16',marginTop:12,marginBottom:7,textAlign:'right'},subtitle:{color:'#69756f',lineHeight:23,textAlign:'right',marginBottom:15},feature:{flexDirection:'row-reverse',backgroundColor:'#fff',borderRadius:18,padding:16,marginBottom:10,borderWidth:1,borderColor:'#e0e6e2'},num:{width:38,textAlign:'center',fontWeight:'900',color:'#66736c'},featureTitle:{fontSize:17,fontWeight:'900',color:'#18211d',textAlign:'right',marginBottom:3},info:{backgroundColor:'#e8efeb',borderRadius:18,padding:18,marginVertical:16},infoTitle:{fontSize:18,fontWeight:'900',color:'#17211c',textAlign:'right'},infoText:{marginTop:7,color:'#596760',lineHeight:23,textAlign:'right'},card:{backgroundColor:'#fff',borderRadius:20,padding:18,marginBottom:12,borderWidth:1,borderColor:'#e0e6e2'},icon:{width:44,height:44,borderRadius:12,backgroundColor:'#111a16',alignItems:'center',justifyContent:'center',alignSelf:'flex-end'},cardTitle:{fontSize:19,fontWeight:'900',color:'#18211d',marginTop:12,textAlign:'right'},link:{color:'#111a16',fontWeight:'900',textAlign:'right',marginTop:13},track:{height:8,backgroundColor:'#dfe6e1',borderRadius:99,overflow:'hidden',marginTop:6},fill:{height:8,backgroundColor:'#111a16'},group:{fontSize:16,fontWeight:'900',color:'#26312c',marginTop:18,marginBottom:10,textAlign:'right'},grid:{flexDirection:'row',flexWrap:'wrap',gap:10},choice:{backgroundColor:'#fff',borderWidth:1,borderColor:'#d8e0db',borderRadius:15,padding:17,marginBottom:10},small:{flexGrow:1,minWidth:'30%'},selected:{backgroundColor:'#111a16',borderColor:'#111a16'},choiceText:{color:'#27322d',fontSize:15,fontWeight:'800',textAlign:'right'},white:{color:'#fff'},summary:{backgroundColor:'#fff',borderRadius:20,padding:18,borderWidth:1,borderColor:'#e0e6e2'},line:{flexDirection:'row-reverse',justifyContent:'space-between',paddingVertical:9,borderBottomWidth:1,borderBottomColor:'#eef1ef'},label:{color:'#7a857f',fontWeight:'700'},value:{color:'#1b2520',fontWeight:'900',flex:1,textAlign:'left',marginRight:12},status:{padding:16,borderRadius:16,marginTop:12},ok:{backgroundColor:'#dcefe3'},warn:{backgroundColor:'#fff0d7'},statusTitle:{fontWeight:'900',fontSize:16,textAlign:'right',color:'#1d2922'},reason:{color:'#66522e',marginTop:6,textAlign:'right',lineHeight:21},input:{backgroundColor:'#fff',borderWidth:1,borderColor:'#d8e0db',borderRadius:14,padding:14,fontSize:15,color:'#17211c',marginBottom:10},multi:{minHeight:100,textAlignVertical:'top'},button:{backgroundColor:'#111a16',borderRadius:16,padding:17,marginTop:16,alignItems:'center'},buttonText:{color:'#fff',fontSize:17,fontWeight:'900'},outline:{backgroundColor:'#fff',borderWidth:1,borderColor:'#d8e0db',borderRadius:16,padding:16,marginTop:10,alignItems:'center'},outlineText:{color:'#28332e',fontSize:16,fontWeight:'800'},footer:{borderTopWidth:1,borderTopColor:'#dce3df',marginTop:30,paddingTop:20,alignItems:'center'},footerBrand:{fontSize:22,fontWeight:'900',color:'#111a16'},footerLinks:{flexDirection:'row',gap:28,marginTop:13},footerNote:{color:'#8a948f',fontSize:12,textAlign:'center',lineHeight:18,marginTop:13}
});
