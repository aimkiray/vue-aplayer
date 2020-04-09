import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop, Provide, Inject } from 'vue-property-decorator';
import Mixin from 'utils/mixin';
import Cover from './Cover';
import Icon from './Icon';
import Main from './Main';
import Controller, { ControllerEvents } from './Controller';
import Button from './Button';

export interface Notice {
  text: string;
  time: number;
  opacity: number;
}

export interface PlayerProps {
  notice?: Notice;
}

@Component({ mixins: [Mixin] })
export default class Player extends Vue.Component<
  PlayerProps,
  ControllerEvents
> {
  @Prop({ type: Object, required: true })
  private readonly notice!: Notice;

  @Inject()
  private readonly aplayer!: APlayer.Options & {
    media: APlayer.Media;
  };

  private readonly isMobile!: boolean;

  private get playIcon(): string {
    return this.aplayer.media.paused ? 'play' : 'pause';
  }

  @Provide()
  private handleTogglePlay() {
    this.$emit('togglePlay');
  }

  @Provide()
  private handleSkipBack() {
    this.$emit('skipBack');
  }

  @Provide()
  private handleSkipForward() {
    this.$emit('skipForward');
  }

  @Provide()
  private handleToggleOrderMode() {
    this.$emit('toggleOrderMode');
  }

  @Provide()
  private handleToggleLoopMode() {
    this.$emit('toggleLoopMode');
  }

  @Provide()
  private handleTogglePlaylist() {
    this.$emit('togglePlaylist');
  }

  @Provide()
  private handleToggleLyric() {
    this.$emit('toggleLyric');
  }

  @Provide()
  private handleChangeVolume(volume: number) {
    this.$emit('changeVolume', volume);
  }

  @Provide()
  private handleChangeProgress(e: MouseEvent | TouchEvent, percent: number) {
    this.$emit('changeProgress', e, percent);
  }

  private handleMiniSwitcher() {
    this.$emit('miniSwitcher');
  }

  private get bodyStyle() {
    return {
      paddingRight: `${this.aplayer.filled ? 0 : 18}px`,
      width: `calc(100% - ${this.aplayer.filled ? 0 : 18}px)`,
    };
  }

  render() {
    const { playIcon, notice, isMobile, bodyStyle } = this;
    const { filled } = this.aplayer;

    return (
      <div class="aplayer-body" style={bodyStyle}>
        {(!filled || isMobile) ? (
          <Cover onClick={this.handleTogglePlay}>
            <div class={`aplayer-button aplayer-${playIcon}`}>
              <Icon type={playIcon} />
            </div>
          </Cover>
        ) : null}
        <Main>
          <Controller
            onSkipBack={this.handleSkipBack}
            onSkipForward={this.handleSkipForward}
            onTogglePlay={this.handleTogglePlay}
            onToggleOrderMode={this.handleToggleOrderMode}
            onToggleLoopMode={this.handleToggleLoopMode}
            onTogglePlaylist={this.handleTogglePlaylist}
            onToggleLyric={this.handleToggleLyric}
            onChangeVolume={this.handleChangeVolume}
            onChangeProgress={this.handleChangeProgress}
          />
        </Main>
        {(!filled) ? (
          <div class="aplayer-notice" style={{ opacity: notice.opacity }}>
            {notice.text}
          </div>
        ) : null}
        {(!filled) ? (
          <div class="aplayer-miniswitcher" onClick={this.handleMiniSwitcher}>
            <Button type="miniswitcher" icon="right"/>
          </div>
        ) : null}
      </div>
    );
  }
}
