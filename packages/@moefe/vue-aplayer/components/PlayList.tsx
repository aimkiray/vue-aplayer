import * as Vue from 'vue-tsx-support';
import Component from 'vue-class-component';
import { Prop, Inject, Watch } from 'vue-property-decorator';
import classNames from 'classnames';
import Mixin from 'utils/mixin';

export interface PlayListProps {
  visible?: boolean;
  currentMusic: APlayer.Audio;
  dataSource: APlayer.Audio[];
  scrollTop: number;
}

export interface PlayListEvents {
  onChange: (music: APlayer.Audio, index: number) => void;
}

@Component({ mixins: [Mixin] })
export default class PlayList extends Vue.Component<
  PlayListProps,
  PlayListEvents
> {
  public readonly $refs!: {
    list: HTMLOListElement;
  };

  @Prop({ type: Boolean, required: false, default: true })
  private readonly visible?: boolean;

  @Prop({ type: Object, required: true })
  private readonly currentMusic!: APlayer.Audio;

  @Prop({ type: Array, required: true })
  private readonly dataSource!: Array<APlayer.Audio>;

  @Prop({ type: Number, required: true })
  private readonly scrollTop!: number;

  private readonly isMobile!: boolean;

  @Inject()
  private readonly aplayer!: APlayer.Options & {
    currentTheme: string;
  };

  private get freeStyle() {
    return (this.aplayer.filled && !this.isMobile);
  }

  private get listHeight(): number {
    const { visible, dataSource } = this;
    // eslint-disable-next-line no-nested-ternary
    return visible
      ? this.freeStyle
        ? 293
        : Math.min(dataSource.length * 33, Number(this.aplayer.listMaxHeight))
      : 0;
  }

  @Watch('scrollTop', { immediate: true })
  @Watch('dataSource', { immediate: true, deep: true })
  @Watch('visible')
  private async handleChangeScrollTop() {
    await this.$nextTick();
    if (this.visible) {
      this.$refs.list.scrollTop = this.scrollTop;
    }
  }

  render() {
    const { listHeight, dataSource, currentMusic } = this;
    const { currentTheme, filled } = this.aplayer;

    return (
      <ol ref="list" class="aplayer-list" style={{ height: `${listHeight}px` }}>
        {dataSource.map((item, index) => (
          <li
            key={item.id}
            class={classNames({
              'aplayer-list-light': item.id === currentMusic.id,
            })}
            onClick={() => this.$emit('change', item, index)}
          >
            <span
              class="aplayer-list-cur"
              style={{
                backgroundColor: currentTheme,
              }}
            />
            <span class="aplayer-list-index">{index + 1}</span>{' '}
            <span class="aplayer-list-title">{item.name}</span>
            <span class="aplayer-list-author">{item.artist}</span>
          </li>
        ))}
      </ol>
    );
  }
}
