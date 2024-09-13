<script setup lang="ts">
import type { Key } from 'ant-design-vue/es/vc-tree/interface';

import { ref } from 'vue';

import {
  CodeMirror,
  type LanguageSupport,
  useVbenModal,
} from '@vben/common-ui';
import { Icon } from '@vben/icons';

import { Tree } from 'ant-design-vue';

import { data } from './preview.json';

interface TreeNode {
  children: TreeNode[];
  title: string;
  key: string;
  icon: string; // 树左边图标
}

const treeData = ref<TreeNode[]>([]);
/** modal标题 */
const modalTitle = ref('代码预览');
/** 代码内容 */
const codeContent = ref('点击左侧树节点查看代码');

const [BasicModal] = useVbenModal({
  onOpenChange(isOpen) {
    if (!isOpen) {
      return null;
    }
    const tree = convertToTree(Object.keys(data));
    treeData.value = tree;
  },
});

/**
 * 文件路径数组转树结构
 * @param paths 文件路径数组
 */
function convertToTree(paths: string[]): TreeNode[] {
  const tree: TreeNode[] = [];

  for (const path of paths) {
    const segments = path.split('/');
    let currentNode = tree;
    let currentPath = '';

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      currentPath += `${segment}`;
      if (i !== segments.length - 1) {
        currentPath += '/';
      }

      const existingNode = currentNode.find((node) => node.title === segment);

      if (existingNode) {
        currentNode = existingNode.children || [];
      } else {
        const title = (segment ?? '').replace('.vm', '');
        const newNode: TreeNode = {
          icon: findIcon(currentPath),
          key: currentPath,
          title,
          children: [],
        };
        currentNode.push(newNode);
        currentNode = newNode.children;
      }
    }
  }

  return tree;
}

const iconMap = [
  { key: 'java', value: 'skill-icons:java-light' },
  { key: 'xml', value: 'tabler:file-type-xml' },
  { key: 'sql', value: 'carbon:sql' },
  { key: 'ts', value: 'skill-icons:typescript' },
  { key: 'vue', value: 'logos:vue' },
  { key: 'folder', value: 'flat-color-icons:folder' },
];
function findIcon(path: string) {
  const defaultFileIcon = 'bx:file';
  const defaultFolderIcon = 'flat-color-icons:folder';
  if (path.endsWith('.vm')) {
    const realPath = path.slice(0, -3);
    // 是否为指定拓展名
    const icon = iconMap.find((item) => realPath.endsWith(item.key));
    if (icon) {
      return icon.value;
    }
    return defaultFileIcon;
  }
  // 其他的为文件夹
  return defaultFolderIcon;
}

const language = ref<LanguageSupport>('html');
function changeLanguageType(filename: string) {
  const typeList: { language: LanguageSupport; type: string }[] = [
    { language: 'ts', type: '.ts' },
    { language: 'java', type: '.java' },
    { language: 'xml', type: '.xml' },
    { language: 'sql', type: 'sql' },
    { language: 'vue', type: '.vue' },
  ];
  const type = typeList.find((item) => filename.includes(item.type));
  language.value = type ? type.language : 'html';
}

function handleSelect(selectedKeys: Key[]) {
  const [currentFile = ''] = selectedKeys as string[];
  const currentCode = data[currentFile as keyof typeof data];
  if (currentCode) {
    // 设置代码type
    changeLanguageType(currentFile);
    // 内容
    codeContent.value = currentCode;
    // 修改标题
    modalTitle.value = `代码预览: ${currentFile.replace('.vm', '')}`;
  }
}
</script>

<template>
  <BasicModal
    :footer="false"
    :fullscreen="true"
    :fullscreen-button="false"
    :title="modalTitle"
  >
    <div class="flex gap-[8px]">
      <Tree
        v-if="treeData.length > 0"
        :tree-data="treeData"
        class="w-[300px]"
        default-expand-all
        @select="handleSelect"
      >
        <template #title="{ title, icon }">
          <div class="flex items-center gap-[16px]">
            <Icon :icon="icon" />
            <span>{{ title }}</span>
          </div>
        </template>
      </Tree>
      <CodeMirror
        v-model="codeContent"
        :language="language"
        class="h-[calc(100vh-80px)] w-full overflow-y-scroll text-[16px]"
        readonly
      />
    </div>
  </BasicModal>
</template>

<style lang="scss" scoped>
:deep(.ant-tree .ant-tree-switcher) {
  display: flex;
  align-items: center;
}

/** codeMirror 占满容器高度 即calc计算的高度 */
:deep(.cm-editor) {
  height: 100%;
}
</style>
