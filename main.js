var t = new BigNumber(0)
var A = new BigNumber(0.992354)	// 1分で90
const NINETY_NINE = new BigNumber(0.99)
var isPause = false;
var isFinished = false;

function calcProgress(time){
	return new BigNumber(1).minus(A.pow(time))
}
function calcDigit(str){
	var digit = 2;
	for(digit = 2; digit <= str.length; digit++){
		if(str[digit] !== '9')
			break;
	}
	return digit;
}

$(function() {
	var bar = new ProgressBar.Line('#container',
		{
			strokeWidth: 1,
		 	easing: 'easeInOut',
			duration: 1400,
			color: '#FFEA82',
			trailColor: '#eee',
			trailWidth: 1,
			svgStyle: {width: '100%', height: '100%'},
			text: {
				style: {
					// Text color.
					// Default: same as stroke color (options.color)
					color: '#555',
					position: 'absolute',
				 	right: '0',
					top: '30px',
					padding: 0,
					margin: 0,
					transform: null
				},
				autoStyleContainer: false
			},
			from: {color: '#FFEA82'},
			to: {color: '#ED6A5A'}
		});
	setInterval(function() {
		if(isPause || isFinished)
			return;
		t = t.plus(1);
		p = calcProgress(t);
		str = p.toPrecision(1000)
		bar.set(parseFloat(str));
		var digit = 2;
		if(p > NINETY_NINE){
			digit = calcDigit(str);
			$('#cancel_button').css('visibility', 'visible');
		}
		bar.setText('Loading... ' + p.times(100).toPrecision(1000).slice(0, digit) + '%');
	}, 16);
});

function cancel(){
	isPause = true;
	$.confirm({
		boxWidth: '300px',
		useBootstrap: false,
		title: '確認',
		content: '読み込みを中止しますか？',
		buttons: {
			confirm: {
				text: 'はい',
				action: function(){
					isFinished = true;
					
					var p = calcProgress(t);
					var str = p.toPrecision(1000);
					var digit = calcDigit(str);
					$.alert({
						title: 'Game Over',
						content: `
							<p>${p.times(100).toPrecision(1000).slice(0, digit)}%まで耐えられました</p>
							<p>忍耐力スコア: ${(digit-2)*100}</p>
							<a href="https://twitter.com/share" class="twitter-share-button" data-text="私の忍耐力は${(digit-2)*100}です" data-lang="ja" data-size="large" data-hashtags="忍耐力を試すゲーム">ツイート</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>
						`,
						boxWidth: '300px',
						useBootstrap: false,
					});
				}
			},
			cancel: {
				text: 'いいえ',
				action: function(){
					isPause = false;
				}
			}
		}
	})
}