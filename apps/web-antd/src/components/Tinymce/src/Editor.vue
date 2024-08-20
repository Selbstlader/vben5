<script lang="ts" setup>
import type { IPropTypes } from '@tinymce/tinymce-vue/lib/cjs/main/ts/components/EditorPropTypes';
import type { Editor as EditorType } from 'tinymce/tinymce';

import {
  computed,
  nextTick,
  onBeforeUnmount,
  onDeactivated,
  onMounted,
  type PropType,
  ref,
  unref,
  useAttrs,
  watch,
} from 'vue';

import { preferences } from '@vben/preferences';

import Editor from '@tinymce/tinymce-vue';
import { isNumber } from 'lodash-es';

import { commonUploadApi, type UploadResult } from '#/api/core/upload';
import { buildShortUUID } from '#/utils/uuid';

import { bindHandlers } from './helper';
import ImgUpload from './ImgUpload.vue';
import {
  plugins as defaultPlugins,
  toolbar as defaultToolbar,
} from './tinymce';

// eslint-disable-next-line vue/order-in-components
defineOptions({ inheritAttrs: false, name: 'Tinymce' });

const props = defineProps({
  height: {
    default: 400,
    required: false,
    type: [Number, String] as PropType<number | string>,
  },
  options: {
    default: () => ({}),
    // eslint-disable-next-line no-use-before-define
    type: Object as PropType<Partial<InitOptions>>,
  },

  plugins: {
    default: defaultPlugins,
    type: String,
  },
  showImageUpload: {
    default: true,
    type: Boolean,
  },
  toolbar: {
    default: defaultToolbar,
    type: String,
  },
  width: {
    default: 'auto',
    required: false,
    type: [Number, String] as PropType<number | string>,
  },
});

const emit = defineEmits(['change']);

type InitOptions = IPropTypes['init'];

/**
 * 外部使用 v-model 绑定值
 */
const modelValue = defineModel('modelValue', { default: '', type: String });
/**
 * https://www.jianshu.com/p/59a9c3802443
 * 使用自托管方案（本地）代替cdn  没有key的限制
 * 注意publicPath要以/结尾
 */
const tinymceScriptSrc = `${import.meta.env.VITE_BASE}tinymce/tinymce.min.js`;

const attrs = useAttrs();
const editorRef = ref<EditorType>();
const fullscreen = ref(false);
const tinymceId = ref<string>(buildShortUUID('tiny-vue'));
const elRef = ref<HTMLElement | null>(null);

const containerWidth = computed(() => {
  const width = props.width;
  if (isNumber(width)) {
    return `${width}px`;
  }
  return width;
});

const skinName = computed(() => {
  const theme =
    preferences.theme.mode === 'auto' ? 'light' : preferences.theme.mode;
  return theme === 'light' ? 'oxide' : 'oxide-dark';
});

const contentCss = computed(() => {
  const theme =
    preferences.theme.mode === 'auto' ? 'light' : preferences.theme.mode;
  return theme === 'light' ? 'default' : 'dark';
});

/**
 * 通过v-if来挂载/卸载组件
 * 来完成主题切换/语言切换
 */
const changeTheme = ref(true);
watch(
  () => [preferences.theme.mode, preferences.app.locale],
  () => {
    if (!editorRef.value) {
      return;
    }
    destroy();
    changeTheme.value = false;
    // 放在下一次tick来切换
    nextTick(() => {
      changeTheme.value = true;
    });
  },
);

/**
 * tinymce支持 en zh_CN
 */
const langName = computed(() => {
  const lang = preferences.app.locale.replace('-', '_');
  if (lang.includes('en_US')) {
    return 'en';
  }
  return 'zh_CN';
});

const initOptions = computed((): InitOptions => {
  const { height, options, plugins, toolbar } = props;
  return {
    auto_focus: true,
    branding: false, // 显示右下角的'使用 TinyMCE 构建'
    content_css: contentCss.value,
    content_style:
      'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
    // contextmenu: 'link image table',
    default_link_target: '_blank',
    height,
    image_advtab: true, // 图片高级选项
    image_caption: true,
    importcss_append: true,
    language: langName.value,
    license_key: 'gpl',
    link_title: false,
    menubar: 'file edit view insert format tools table help',
    noneditable_class: 'mceNonEditable',
    /**
     * 允许粘贴图片 默认base64格式
     * images_upload_handler启用时为上传
     */
    paste_data_images: true,
    plugins,
    // quickbars_selection_toolbar:
    //   'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
    skin: skinName.value,
    toolbar,
    toolbar_mode: 'sliding',
    ...options,
    /**
     * 覆盖默认的base64行为
     * @param blobInfo
     * 大坑 不要调用这两个函数  success failure:
     * 使用resolve/reject代替
     */
    images_upload_handler: (blobInfo) => {
      return new Promise((resolve, reject) => {
        const file = blobInfo.blob();
        // const filename = blobInfo.filename();
        commonUploadApi(file)
          .then((response) => {
            const { url } = response as unknown as UploadResult;
            console.log('tinymce上传图片:', url);
            resolve(url);
          })
          .catch((error) => {
            console.error('tinymce上传图片失败:', error);
            reject(error.message);
          });
      });
    },
    setup: (editor) => {
      editorRef.value = editor;
      editor.on('init', (e) => initSetup(e));
    },
  };
});

/**
 * 监听options.readonly
 */
watch(
  () => props.options,
  (options) => {
    const getDisabled = options && Reflect.get(options, 'readonly');
    const editor = unref(editorRef);
    if (editor) {
      editor.mode.set(getDisabled ? 'readonly' : 'design');
    }
  },
);

watch(
  () => attrs.disabled,
  () => {
    const editor = unref(editorRef);
    if (!editor) {
      return;
    }
    editor.mode.set(attrs.disabled ? 'readonly' : 'design');
  },
);

onMounted(() => {
  if (!initOptions.value.inline) {
    tinymceId.value = buildShortUUID('tiny-vue');
  }
  nextTick(() => {
    setTimeout(() => {
      initEditor();
    }, 30);
  });
});

onBeforeUnmount(() => {
  destroy();
});

onDeactivated(() => {
  destroy();
});

function destroy() {
  const editor = unref(editorRef);
  editor?.destroy();
}

function initEditor() {
  const el = unref(elRef);
  if (el) {
    el.style.visibility = '';
  }
}

function initSetup(e: any) {
  const editor = unref(editorRef);
  if (!editor) {
    return;
  }
  const value = modelValue.value || '';

  editor.setContent(value);
  bindModelHandlers(editor);
  bindHandlers(e, attrs, unref(editorRef));
}

function setValue(editor: Record<string, any>, val?: string, prevVal?: string) {
  if (
    editor &&
    typeof val === 'string' &&
    val !== prevVal &&
    val !== editor.getContent({ format: attrs.outputFormat })
  ) {
    editor.setContent(val);
  }
}

function bindModelHandlers(editor: any) {
  const modelEvents = attrs.modelEvents ?? null;
  const normalizedEvents = Array.isArray(modelEvents)
    ? modelEvents.join(' ')
    : modelEvents;

  watch(
    () => modelValue.value,
    (val, prevVal) => {
      setValue(editor, val, prevVal);
    },
  );

  editor.on(normalizedEvents || 'change keyup undo redo', () => {
    const content = editor.getContent({ format: attrs.outputFormat });
    emit('change', content);
  });

  editor.on('FullscreenStateChanged', (e: any) => {
    fullscreen.value = e.state;
  });
}

/**
 * disabled
 * 可使用:options="{readonly: true}"
 * 或者:disabled="true"
 */
const disabled = computed(
  () =>
    (props.options.readonly ?? false) || ((attrs.disabled as boolean) ?? false),
);

function getUploadingImgName(name: string) {
  return `[uploading:${name}]`;
}

function handleImageUploading(name: string) {
  const editor = unref(editorRef);
  if (!editor) {
    return;
  }
  editor.execCommand('mceInsertContent', false, getUploadingImgName(name));
  const content = editor?.getContent() ?? '';
  setValue(editor, content);
}

function handleDone(name: string, url: string) {
  const editor = unref(editorRef);
  if (!editor) {
    return;
  }
  const content = editor?.getContent() ?? '';
  const val =
    content?.replace(getUploadingImgName(name), `<img src="${url}"/>`) ?? '';
  setValue(editor, val);
}
</script>

<template>
  <div :style="{ width: containerWidth }" class="app-tinymce">
    <ImgUpload
      v-if="showImageUpload"
      v-show="editorRef"
      :disabled="disabled"
      :fullscreen="fullscreen"
      @done="handleDone"
      @uploading="handleImageUploading"
    />
    <Editor
      v-if="!initOptions.inline && changeTheme"
      v-model="modelValue"
      :init="initOptions"
      :style="{ visibility: 'hidden' }"
      :tinymce-script-src="tinymceScriptSrc"
    />
    <slot v-else></slot>
  </div>
</template>

<style lang="scss" scoped>
/**
  隐藏右上角upgrade按钮
  */
:deep(.tox-promotion) {
  display: none !important;
}

.app-tinymce {
  position: relative;
  line-height: normal;

  :deep(.textarea) {
    z-index: -1;
    visibility: hidden;
  }
}
</style>
