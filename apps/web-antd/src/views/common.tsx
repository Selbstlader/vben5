import { defineComponent } from 'vue';

import { Page } from '@vben/common-ui';
import { openWindow } from '@vben/utils';

import { Result } from 'ant-design-vue';

export default defineComponent({
  name: 'CommonSkeleton',
  setup() {
    return () => (
      <Page autoContentHeight={true}>
        <Result
          status="success"
          sub-title="等待后端发布"
          title="已经开发完毕(warmflow分支)"
        >
          {{
            extra: (
              <div>
                <a-button
                  onClick={() => openWindow('http://106.55.255.76')}
                  type="primary"
                >
                  前往工作流版本演示站
                </a-button>
              </div>
            ),
          }}
        </Result>
      </Page>
    );
  },
});
