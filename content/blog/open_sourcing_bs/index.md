+++
title = "Open Sourcing Banana Shooter"
description = "title self explanatory"
date = 2026-09-27

hidden = true

[taxonomies]
# tags = ["banana-shooter"]

[extra.cover]
image = "@/blog/open_sourcing_bs/hero.jpg"
alt = "First-person view of a test arena with ramps and blocks"

+++

## Yes this is REAL, but with a caveat

I open sourced [Banana Shooter](https://github.com/Squalive/banana-shooter) under the MIT license. So you can do whatever you want with it, whether contributing to the project or make a better version of it or just learn some stuff from this project.

But with a caveat that some third party assets are not included due to licensing issues, and I'm talking about most of the audio in the game, and some other stuff. I'm sad to do this, but it's something I need to improve in the future when using third party assets. 

## Why

Ever since I know about open source and its benefits makes me want to do open source development, and the best fitted project for me is Banana Shooter. It's something people loved and dedicated a lot of time into, but it has been abandoned from me, open sourcing means more possibilities for everything, for everyone. With a permissive license, possibilities are just infinite.

## The story

On 2026-09-04 I received a message about a RCE (Remote Code Execution) exploit in Banana Shooter workshop map feature. I instantly disabled Steam UGC transfer and was shocked. Why? Because I literally cannot fix this issue because I don't have proper version control when developing Banana Shooter. And my disk was corrupted. 

But I don't want to leave the game with a RCE like that, so I had the idea of rewriting the entire game using my latest techknowledgy and provide a better experience for players. Then after a few days I realized this is basically impossible for me to finish in just a few weeks, it's going to take **months**.

So I went with the easy route, fixing the broken version of the project source. Initially I thought this was harder so I didn't went with it, but in fact it is way easier to just find bugs and fix them.

It took about 1 week for me to patch the project to a state I can publish a nightly branch for early testing. After 2 weeks of nightly testing, I stabilized  it into the main branch. 

During this process, I realized I can just open source the entire project and people will just like it. So I went down the rabbit hole of open sourcing a commercial product that was never meant to be open sourced in the beginning!

## How I open source Banana Shooter

In order to open source under a permissive license (MIT License), I have to make sure everything I published is legal. For example, I cannot grab some anonymous music or sfx and put it in the repo and call it due to licensing issue.

Fortunately, I didn't have a habit of using third party stuff back in the days when developing Banana Shooter, I'm especially talking about assets from Unity Asset Store. Because Unity Asset Store EULA license does not allow you to redistribute their assets completely, even when they're free. Unless the author license it under MIT or something capable of being redistributable.
Since I own all the code in this project, I'm basically half way done through the open source process, or completely done if I don't care about assets at all which I care.

So I stripped out all unlicensed third party assets (including audios, models, textures, shaders) from the open sourced version.

Last, it's just boring but important third party notices for legal reasons. Because certain licenses require explicit notices from the root of the project.

## Disclaimer

I want to state that I want to do stuff other than Banana Shooter, which means I expect people to make different versions of this game instead of contributing to this game.

And the main contribution will be focused on bugs fixing and exploit patching.
