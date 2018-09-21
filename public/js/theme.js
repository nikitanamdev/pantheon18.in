const panels = document.querySelectorAll('.panel');

function toggleActive(e) {
	if (e.propertyName.includes('flex')) {
		this.classList.toggle('open-active');
	}
}
var select=document.querySelectorAll(".panel");
select[0].addEventListener('click',function(){
	if(this.classList.contains('open')) {
		this.classList.remove('open');
		this.innerHTML="<p></p><p>ENVIRONMENTAL AWARENESS</p><p></p>";
	}
	else {
		for(var i=0;i<3;i++) {
			if(select[i].classList.contains("open")) {
				select[i].classList.remove('open');
				if(i==0)
				select[i].innerHTML="<p></p><p>ENVIRONMENTAL AWARENESS</p><p></p>";
				else if(i==1)
				select[i].innerHTML="<p></p><p>TECHSTONES</p><p></p>";
				else if(i==2)
				select[i].innerHTML="<p></p><p>REVIVING THE ART & CULTURES OF INDIA</p><p></p>";
			}
		}
		this.classList.add('open');
		setTimeout(function(){
			select[0].innerHTML="<p style='font-size: 3.4em'>ENVIRONMENTAL AWARENESS</p><p class='addGreen' style='font-size: 1.5em; margin: 0 auto'>Our planet earth provides us with an ecosystem in which living organisms of numerous species can thrive and survive. Technological advancement has been as severe a curse as it has been a boon. Our modern lifestyle has exploited nature in various forms leading to global warming, pollution and various other forms of environmental disturbances; the most recent of them being the floods in Kerala. BIT Mesra has joined hands with the National Service Scheme to donate necessary aid to the victims of the calamity. Numerous plantation drives are also being undertaken to conserve Mother Nature. We advocate to nurse the irrevocable damage that has been incurred to our only home.</p><p></p>"
		},400);
	}
});
select[1].addEventListener('click',function(){
	if(this.classList.contains('open')) {
		this.classList.remove('open');
		this.innerHTML="<p></p><p>TECHSTONES</p><p></p>";
	}
	else {
		for(var i=0;i<3;i++) {
			if(select[i].classList.contains("open")) {
				select[i].classList.remove('open');
				if(i==0)
				select[i].innerHTML="<p></p><p>ENVIRONMENTAL AWARENESS</p><p></p>";
				else if(i==1)
				select[i].innerHTML="<p></p><p>TECHSTONES</p><p></p>";
				else if(i==2)
				select[i].innerHTML="<p></p><p>REVIVING THE ART & CULTURES OF INDIA</p><p></p>";
			}
		}
		this.classList.add('open');
		setTimeout(function(){
			select[1].innerHTML="<p style='font-size: 3.4em'>TECHSTONES</p><p class='addYellow' style='font-size: 1.5em; margin: 0 auto'>Technology is the novel conjunction of groundbreaking scientific ideas with experiential applications. Over the years, it has not only paved way for advancement but has also helped to shape the history of this world as such.Be it the fascinating mechanism of the boilers, the convoluted structure of the television or the multifarious pertinence of Machine Learning, &rdquo;The great growling engine of change&rdquo;, technology will always continue to evoke streaks of innovation and spark a fuelling zeal among the trailblazers of the society.Pantheon has always strived towards promoting the modern marvels and with the theme of &rdquo;TECHSTONES-Then.Now.Next&rdquo;, Pantheon'18 aims to be the avant-garde of this technological magnificence.</p><p></p>"
		},400);
	}
});

select[2].addEventListener('click',function(){
	if(this.classList.contains('open')) {
		this.classList.remove('open');
		this.innerHTML="<p></p><p>REVIVING THE ART & CULTURES OF INDIA</p><p></p>";
	}
	else {
		for(var i=0;i<3;i++) {
			if(select[i].classList.contains("open")) {
				select[i].classList.remove('open');
				if(i==0)
				select[i].innerHTML="<p></p><p>ENVIRONMENTAL AWARENESS</p><p></p>";
				else if(i==1)
				select[i].innerHTML="<p></p><p>TECHSTONES</p><p></p>";
				else if(i==2)
				select[i].innerHTML="<p></p><p>REVIVING THE ART & CULTURES OF INDIA</p><p></p>";
			}
		}
		this.classList.add('open');
		setTimeout(function(){
			select[2].innerHTML="<p style='font-size: 3.4em'>REVIVING THE ART & CULTURES OF INDIA</p><p class='addBlue' style='font-size: 1.5em; margin: 0 5px'>India has always been famous for its traditions and hospitality. Ancient customs such as the &ldquo;Namaste&rdquo; to the exchange of flower garlands in wedding ceremonies are still very much a part of the Indian culture. Whether it is the riveting Patachitra cloth paintings born in the Jagannath Temple in Puri, the vibrant and stark lacquer work from Rajasthan or the elaborate bidri craft from Karnataka and Hyderabad, traditional Indian arts and culture embody the highest levels of artistic excellence, with a legacy that dates back hundreds of years.The traditional arts and culture have stood the test of time, until now. It is no secret that the arts and crafts have shown a declining trend over the past few decades. After prospering for centuries, many arts are now fighting for survival.Despite the flagrant decline of Indian arts, there is hope on the horizon. A dedicated community of individuals and groups, scattered all across the country, are stoically playing their part to protect our glorious traditions from fading away into oblivion. Their modes of operation do differ, but the objective is the same- to preserve the legacy of traditional Indian arts in all its vibrancy and glory.</p><p></p>"
		},400);
	}
});

panels.forEach(panel => panel.addEventListener('transitionend', toggleActive));