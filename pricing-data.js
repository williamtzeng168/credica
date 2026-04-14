// Auto-synced from billing.tier_definitions — update when pricing changes
var CREDICA_TIERS = [
  {id:"free",name:"Free",price_ntd:0,price_label:"NT$0 免費",member_quota:10,vc_quota:10,ai_quota:50,push_quota:20,line_type:"shared"},
  {id:"starter",name:"Starter",price_ntd:990,price_label:"NT$990/月",member_quota:100,vc_quota:100,ai_quota:300,push_quota:100,line_type:"shared"},
  {id:"pro",name:"Pro",price_ntd:2990,price_label:"NT$2,990/月",member_quota:1000,vc_quota:1000,ai_quota:1000,push_quota:-1,line_type:"dedicated"},
  {id:"enterprise",name:"Enterprise",price_ntd:0,price_label:"專案報價",member_quota:-1,vc_quota:-1,ai_quota:-1,push_quota:-1,line_type:"dedicated"}
];
