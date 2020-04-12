import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Inject, Prop, Watch } from 'vue-property-decorator';
import Mixin from 'utils/mixin';

export interface CoverEvents {
  onClick?: MouseEvent
}

@Component({ mixins: [Mixin] })
export default class Cover extends Vue.Component<{}, CoverEvents> {
  private readonly isMobile!: boolean;

  private clientWidth = document.body.clientWidth;

  @Inject()
  private readonly aplayer!: APlayer.Options & {
    options: APlayer.InstallOptions;
    currentTheme: string;
    currentMusic: APlayer.Audio;
  };

  private get music() {
    const { currentMusic, filled } = this.aplayer;
    let { artist } = currentMusic;
    if (!filled) {
      artist = artist ? ` - ${artist}` : 'akari';
    } else {
      artist = artist || 'akari';
    }
    return {
      name: currentMusic.name,
      artist,
    };
  }

  private get freeStyle() {
    return this.aplayer.filled && !this.isMobile;
  }

  private get marginLeft() {
    const { music, freeStyle } = this;
    // 计算 music title 的 width，用于确定居中位置
    const musicWidth = Math.max(Cover.strLen(music.name) * 8,
      Cover.strLen(music.artist) * 7) + 16;
    // 计算居中位置并取整
    return freeStyle
      // @ts-ignore
      ? parseInt(this.clientWidth / 2 - musicWidth / 2, 10) - 25
      : 0;
  }

  private get style() {
    const { options, currentTheme, currentMusic } = this.aplayer;
    const cover = currentMusic.cover || options.defaultCover;

    return {
      backgroundImage: cover && `url("${cover}")`,
      backgroundColor: currentTheme,
      marginLeft: `${this.marginLeft}px`,
    };
  }

  private static strLen(str: any) {
    let len = 0;
    for (let i = 0; i < str.length; i++) {
      if (str.charCodeAt(i) > 127 || str.charCodeAt(i) === 94) {
        len += 2;
      } else {
        len += 1;
      }
    }
    return len;
  }

  beforeMount() {
    window.onresize = () => {
      this.clientWidth = document.body.clientWidth;
    };
  }

  // TODO fix multiple instances conflict
  // @Watch('clientWidth')
  // private handleMarginLeft() {
  //   // @ts-ignore
  //   this.$refs.aplayerPic[0].style.marginLeft = `${this.marginLeft}px`;
  // }

  private handleClick(e: MouseEvent) {
    this.$emit('click', e);
  }

  render() {
    return (
      <div class="aplayer-pic" style={this.style} onClick={this.handleClick}>
        {this.$slots.default}
      </div>
    );
  }
}
