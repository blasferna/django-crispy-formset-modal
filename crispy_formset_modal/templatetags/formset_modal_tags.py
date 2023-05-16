from uuid import uuid4

from django import template

register = template.Library()


class UUID4Node(template.Node):
    """
    Implements the logic of this tag.
    """

    def __init__(self, var_name):
        self.var_name = var_name

    def render(self, context):
        context[self.var_name] = str(uuid4())
        return ""


class EscapeScriptNode(template.Node):
    TAG_NAME = "escapescript"

    def __init__(self, nodelist):
        super(EscapeScriptNode, self).__init__()
        self.nodelist = nodelist

    def render(self, context):
        out = self.nodelist.render(context)
        escaped_out = out.replace("</script>", "<\\/script>")
        return escaped_out


def do_uuid4(parser, token):
    """
    This template tag is designed to create a random UUID and save it
    within a specified context variable.
    Example usage:
        {% uuid4 variable_name %}
        variable_name will hold the generated UUID
    """
    try:
        tag_name, var_name = token.split_contents()
    except ValueError:
        raise template.TemplateSyntaxError(
            "%r tag requires exactly one argument" % token.contents.split()[0]
        )
    return UUID4Node(var_name)


@register.tag(EscapeScriptNode.TAG_NAME)
def media(parser, token):
    nodelist = parser.parse(("end" + EscapeScriptNode.TAG_NAME,))
    parser.delete_first_token()
    return EscapeScriptNode(nodelist)


do_uuid = register.tag("uuid4", do_uuid4)
