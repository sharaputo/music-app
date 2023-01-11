import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import PlaylistItem from "@/components/PlaylistItem.vue";

describe("Snapshot PlaylistItem.vue", () => {
  it("renders correctly", () => {
    const track = {
      docId: "123",
      modified_name: "test",
      display_name: "test 2",
      comment_count: 2,
    };

    const wrapper = shallowMount(PlaylistItem, {
      propsData: { track },
      global: {
        stubs: { RouterLink: RouterLinkStub },
      },
    });

    expect(wrapper.element).toMatchSnapshot();
  });
});
