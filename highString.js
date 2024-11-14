function longChar(s) {
    let count = 0;
    let map = {}
    
    if ( !(1 <= s.length && s.length <= 100) ) return 'string length: ' + s.length + ' is out of bound';
      let formatStr = s.replace(/[^a-zA-Z]/g, "");
      
      formatStr.split('').map((char) => {
          if(map[char]){
            count = map[char];
          count++;
          map[char] = count
        }
          if(map[char] === undefined){
            count = 1;
          map[char] = count;
        }
        
    })

      let values = Object.values(map);
      let keys = Object.keys(map);
      let highIndex = Object.values(map).indexOf(Math.max(...values ))
      
      console.log( keys[highIndex] )
      
      return map
}
    
const str = "aakiAKDNEKSKSKNEJDNSJKLSNKWLMAKDOWMFCLKSsassyhwywjsgagkcdj1678293"
// console.log(longestChar(str))
console.log(longestAlpha('HHHty7382LL;;'))

function longestAlpha(str) {
  const map = {};

  for (let i = 0; i < str.length; i++ ){
    if(/a-zA-Z/.test()){
      console.log(str[i])
    }
  }
}