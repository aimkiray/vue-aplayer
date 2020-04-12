import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Inject } from 'vue-property-decorator';
import Mixin from 'utils/mixin';
import Lyric from './Lyric';
import Cover from './Cover';
import Icon from './Icon';

@Component({ mixins: [Mixin] })
export default class Main extends Vue.Component<{}> {
  @Inject()
  private readonly aplayer!: APlayer.Options & {
    currentMusic: APlayer.Audio;
  };

  private readonly isMobile!: boolean;

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

  render() {
    const { music, isMobile } = this;
    const { fixed, filled } = this.aplayer;

    return (
      <div class="aplayer-info">
        {(filled && !isMobile) ? (
          <Cover />
        ) : null}
        <div class="aplayer-music">
          <span class="aplayer-title">{music.name}</span>
          <span class="aplayer-author">{music.artist}</span>
        </div>
        {!fixed ? <Lyric /> : null}
        {this.$slots.default}
      </div>
    );
  }
}
